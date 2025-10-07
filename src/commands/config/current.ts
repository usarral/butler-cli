import { configManager } from "../../utils/config";
import chalk from "chalk";

export async function showCurrentConfig(): Promise<void> {
  const currentConfigName = configManager.getCurrentConfig();
  
  if (!currentConfigName) {
    console.log(chalk.yellow("⚠️  No hay ninguna configuración activa"));
    console.log(chalk.gray("💡 Usa 'butler-cli config list' para ver las disponibles"));
    console.log(chalk.gray("💡 Usa 'butler-cli config use <nombre>' para activar una"));
    return;
  }

  const config = configManager.loadConfig(currentConfigName);
  
  if (!config) {
    console.error(chalk.red(`❌ Error: configuración activa '${currentConfigName}' no encontrada`));
    return;
  }

  console.log(chalk.blue("🎯 Configuración activa\n"));
  console.log(`${chalk.green("●")} ${chalk.cyan(config.name)}`);
  console.log(`   📍 ${config.url}`);
  console.log(`   👤 ${config.username}`);
  console.log(`   🔑 Token: ${"*".repeat(Math.min(config.token.length, 20))}`);
  if (config.description) {
    console.log(`   📝 ${config.description}`);
  }
  
  console.log(chalk.gray(`\n📁 Ubicación: ${configManager.getConfigDir()}`));
}