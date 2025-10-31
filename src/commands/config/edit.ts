import { configManager } from "../../utils/config";
import { logger } from "../../utils/logger";
import { messages as msg } from "../../utils/messages";
import { formatters } from "../../utils/formatters";
import inquirer from "inquirer";

export async function editConfigPreferences(configName?: string) {
  try {
    let targetConfig = configName;
    
    // Si no se especifica configuración, usar la actual
    if (!targetConfig) {
      const currentConfig = configManager.getCurrentConfig();
      
      if (!currentConfig) {
        logger.error(formatters.error(`${msg.icons.error} ${msg.errors.noActiveConfig}`));
        logger.info(formatters.warning(`${msg.icons.info} ${msg.hints.editConfig}`));
        process.exit(1);
      }
      
      targetConfig = currentConfig;
      logger.info(formatters.secondary(msg.info.editingActiveConfig(targetConfig) + '\n'));
    }
    
    // Cargar configuración
    const config = configManager.loadConfig(targetConfig);
    
    if (!config) {
      logger.error(formatters.error(`${msg.icons.error} ${msg.errors.configNotFound(targetConfig)}`));
      process.exit(1);
    }
    
    logger.info(formatters.info(`${msg.icons.gear} Editar Preferencias de Configuración\n`));
    
    // Valores actuales
    const currentEditor = config.preferences?.editor || '';
    const currentLogViewer = config.preferences?.logViewer || '';
    const currentLogsDir = config.preferences?.downloadLogsDir || '';
    
    // Preguntar por las preferencias
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'editor',
        message: msg.prompts.editorPreferred,
        default: currentEditor,
      },
      {
        type: 'input',
        name: 'logViewer',
        message: msg.prompts.logViewer,
        default: currentLogViewer,
      },
      {
        type: 'input',
        name: 'downloadLogsDir',
        message: msg.prompts.downloadLogsDir,
        default: currentLogsDir,
      },
    ]);
    
    // Actualizar configuración
    config.preferences = {
      editor: answers.editor || undefined,
      logViewer: answers.logViewer || undefined,
      downloadLogsDir: answers.downloadLogsDir || undefined,
    };
    
    // Guardar configuración
    configManager.saveConfig(config);
    
    logger.info(formatters.success(`\n${msg.icons.success} ${msg.success.preferencesUpdated(targetConfig)}`));
    
    // Mostrar resumen
    logger.info(formatters.info(`\n${msg.icons.list} ${msg.labels.preferences}`));
    logger.info(`  ${formatters.bold(msg.labels.editor)} ${config.preferences.editor || formatters.secondary(msg.values.notConfigured)}`);
    logger.info(`  ${formatters.bold(msg.labels.logViewer)} ${config.preferences.logViewer || formatters.secondary(msg.values.useEditorPrimary)}`);
    logger.info(`  ${formatters.bold(msg.labels.logsDir)} ${config.preferences.downloadLogsDir || formatters.secondary(msg.values.defaultLogsDir)}`);
    
  } catch (error: any) {
    logger.error(formatters.error(`${msg.icons.error} ${msg.errors.generic}: ${error.message}`));
    process.exit(1);
  }
}
