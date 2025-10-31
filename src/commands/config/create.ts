import inquirer from "inquirer";
import { configManager, JenkinsConfig } from "../../utils/config";
import { logger } from "../../utils/logger";
import { messages as msg } from "../../utils/messages";
import { formatters } from "../../utils/formatters";

export async function createConfig(): Promise<void> {
  logger.info(formatters.info(`${msg.icons.gear} Crear nueva configuración de Jenkins\n`));

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: msg.prompts.configName,
      validate: (input) => {
        if (!input.trim()) {
          return "El nombre es requerido";
        }
        if (configManager.listConfigs().includes(input.trim())) {
          return "Ya existe una configuración con ese nombre";
        }
        return true;
      },
    },
    {
      type: "input",
      name: "url",
      message: msg.prompts.jenkinsUrl,
      validate: (input) => {
        if (!input.trim()) {
          return "La URL es requerida";
        }
        try {
          new URL(input.trim());
          return true;
        } catch {
          return "Por favor ingresa una URL válida";
        }
      },
    },
    {
      type: "input",
      name: "username",
      message: msg.prompts.username,
      validate: (input) => input.trim() ? true : "El usuario es requerido",
    },
    {
      type: "password",
      name: "token",
      message: msg.prompts.token,
      validate: (input) => input.trim() ? true : "El token es requerido",
    },
    {
      type: "input",
      name: "description",
      message: msg.prompts.description,
    },
    {
      type: "confirm",
      name: "setAsCurrent",
      message: msg.prompts.setAsActive,
      default: true,
    },
  ]);

  const config: JenkinsConfig = {
    name: answers.name.trim(),
    url: answers.url.trim(),
    username: answers.username.trim(),
    token: answers.token.trim(),
    description: answers.description?.trim() || undefined,
  };

  try {
    configManager.saveConfig(config);
    logger.info(formatters.success(`${msg.icons.success} ${msg.success.configCreated(config.name)}`));

    if (answers.setAsCurrent) {
      configManager.setCurrentConfig(config.name);
      logger.info(formatters.success(`${msg.icons.success} ${msg.success.configActivated(config.name)}`));
    }

    logger.info(formatters.secondary(`${msg.icons.folder} Guardada en: ${configManager.getConfigDir()}`));
  } catch (error) {
    logger.error(formatters.error(`${msg.icons.error} Error creando la configuración: ${error}`));
  }
}