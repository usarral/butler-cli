import inquirer from "inquirer";
import { configManager, JenkinsConfig } from "../../utils/config";
import chalk from "chalk";

export async function createConfig(): Promise<void> {
  console.log(chalk.blue("🔧 Crear nueva configuración de Jenkins\n"));

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Nombre para la configuración:",
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
      message: "URL del servidor Jenkins:",
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
      message: "Usuario de Jenkins:",
      validate: (input) => input.trim() ? true : "El usuario es requerido",
    },
    {
      type: "password",
      name: "token",
      message: "Token de API de Jenkins:",
      validate: (input) => input.trim() ? true : "El token es requerido",
    },
    {
      type: "input",
      name: "description",
      message: "Descripción (opcional):",
    },
    {
      type: "confirm",
      name: "setAsCurrent",
      message: "¿Establecer como configuración activa?",
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
    console.log(chalk.green(`✅ Configuración '${config.name}' creada exitosamente`));

    if (answers.setAsCurrent) {
      configManager.setCurrentConfig(config.name);
      console.log(chalk.green(`✅ Configuración '${config.name}' establecida como activa`));
    }

    console.log(chalk.gray(`📁 Guardada en: ${configManager.getConfigDir()}`));
  } catch (error) {
    console.error(chalk.red(`❌ Error creando la configuración: ${error}`));
  }
}