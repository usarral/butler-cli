import { configManager } from "../../utils/config";
import chalk from "chalk";

export async function listConfigs(): Promise<void> {
  console.log(chalk.blue("📋 Configuraciones de Jenkins disponibles\n"));

  const configs = configManager.listConfigs();
  const currentConfig = configManager.getCurrentConfig();

  if (configs.length === 0) {
    console.log(chalk.yellow("⚠️  No hay configuraciones guardadas"));
    console.log(chalk.gray("💡 Usa 'butler-cli config create' para crear una"));
    return;
  }

  configs.forEach((configName) => {
    const config = configManager.loadConfig(configName);
    const isActive = configName === currentConfig;
    
    if (config) {
      const status = isActive ? chalk.green("● ACTIVA") : chalk.gray("○");
      console.log(`${status} ${chalk.cyan(configName)}`);
      console.log(`   📍 ${config.url}`);
      console.log(`   👤 ${config.username}`);
      if (config.description) {
        console.log(`   📝 ${config.description}`);
      }
      console.log();
    }
  });

  if (!currentConfig) {
    console.log(chalk.yellow("⚠️  No hay ninguna configuración activa"));
    console.log(chalk.gray("💡 Usa 'butler-cli config use <nombre>' para activar una"));
  }

  console.log(chalk.gray(`📁 Ubicación: ${configManager.getConfigDir()}`));
}