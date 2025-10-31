import { configManager } from "../../utils/config";
import { logger } from "../../utils/logger";
import { messages as msg } from "../../utils/messages";
import { formatters } from "../../utils/formatters";

export async function useConfig(name: string): Promise<void> {
  if (!name) {
    logger.error(formatters.error(`${msg.icons.error} Debes especificar el nombre de la configuración`));
    logger.info(formatters.secondary(`${msg.icons.info} Uso: butler-cli config use <nombre>`));
    return;
  }

  const config = configManager.loadConfig(name);
  
  if (!config) {
    logger.error(formatters.error(`${msg.icons.error} ${msg.errors.configNotFound(name)}`));
    logger.info(formatters.secondary(`${msg.icons.info} Usa 'butler-cli config list' para ver las disponibles`));
    return;
  }

  const success = configManager.setCurrentConfig(name);
  
  if (success) {
    logger.info(formatters.success(`${msg.icons.success} ${msg.success.configActivated(name)}`));
    logger.info(formatters.secondary(`${msg.icons.location} Servidor: ${config.url}`));
    logger.info(formatters.secondary(`${msg.icons.user} Usuario: ${config.username}`));
  } else {
    logger.error(formatters.error(`${msg.icons.error} Error estableciendo la configuración '${name}' como activa`));
  }
}