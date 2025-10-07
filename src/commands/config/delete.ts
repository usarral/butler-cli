import inquirer from "inquirer";
import { configManager } from "../../utils/config";
import chalk from "chalk";

export async function deleteConfig(name?: string): Promise<void> {
  const configs = configManager.listConfigs();
  
  if (configs.length === 0) {
    console.log(chalk.yellow("⚠️  No hay configuraciones para eliminar"));
    return;
  }

  let configToDelete = name;

  // Si no se especificó un nombre, mostrar lista para seleccionar
  if (!configToDelete) {
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "config",
        message: "¿Qué configuración deseas eliminar?",
        choices: configs,
      },
    ]);
    configToDelete = answers.config;
  }

  // Verificar que la configuración existe
  if (!configToDelete) {
    console.error(chalk.red("❌ No se especificó configuración para eliminar"));
    return;
  }

  const config = configManager.loadConfig(configToDelete);
  if (!config) {
    console.error(chalk.red(`❌ No se encontró la configuración '${configToDelete}'`));
    return;
  }

  // Confirmación de eliminación
  const confirmation = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: `¿Estás seguro de que deseas eliminar la configuración '${configToDelete}'?`,
      default: false,
    },
  ]);

  if (!confirmation.confirm) {
    console.log(chalk.gray("Operación cancelada"));
    return;
  }

  const success = configManager.deleteConfig(configToDelete);
  
  if (success) {
    console.log(chalk.green(`✅ Configuración '${configToDelete}' eliminada exitosamente`));
    
    // Si era la configuración activa, informar al usuario
    const currentConfig = configManager.getCurrentConfig();
    if (!currentConfig) {
      console.log(chalk.yellow("⚠️  No hay configuración activa ahora"));
      if (configs.length > 1) { // Había más de una configuración
        console.log(chalk.gray("💡 Usa 'butler-cli config use <nombre>' para activar otra"));
      }
    }
  } else {
    console.error(chalk.red(`❌ Error eliminando la configuración '${configToDelete}'`));
  }
}