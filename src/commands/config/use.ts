import { configManager } from "../../utils/config";
import chalk from "chalk";

export async function useConfig(name: string): Promise<void> {
  if (!name) {
    console.error(chalk.red("❌ Debes especificar el nombre de la configuración"));
    console.log(chalk.gray("💡 Uso: butler-cli config use <nombre>"));
    return;
  }

  const config = configManager.loadConfig(name);
  
  if (!config) {
    console.error(chalk.red(`❌ No se encontró la configuración '${name}'`));
    console.log(chalk.gray("💡 Usa 'butler-cli config list' para ver las disponibles"));
    return;
  }

  const success = configManager.setCurrentConfig(name);
  
  if (success) {
    console.log(chalk.green(`✅ Configuración '${name}' establecida como activa`));
    console.log(chalk.gray(`📍 Servidor: ${config.url}`));
    console.log(chalk.gray(`👤 Usuario: ${config.username}`));
  } else {
    console.error(chalk.red(`❌ Error estableciendo la configuración '${name}' como activa`));
  }
}