import axios, { AxiosInstance } from "axios";
import { getJenkinsConfig } from "./config";
import chalk from "chalk";

let jenkinsInstance: AxiosInstance | null = null;

function createJenkinsClient(): AxiosInstance {
  const config = getJenkinsConfig();
  
  if (!config) {
    console.error(chalk.red("❌ No se encontró configuración de Jenkins."));
    console.error(chalk.yellow("💡 Usa 'butler-cli config create' para crear una configuración."));
    process.exit(1);
  }

  return axios.create({
    baseURL: config.url,
    auth: {
      username: config.username,
      password: config.token,
    },
  });
}

export function getJenkinsClient(): AxiosInstance {
  if (!jenkinsInstance) {
    jenkinsInstance = createJenkinsClient();
  }
  return jenkinsInstance;
}

// Para compatibilidad con el código existente
export const jenkins = new Proxy({} as AxiosInstance, {
  get(target, prop) {
    const client = getJenkinsClient();
    return client[prop as keyof AxiosInstance];
  }
});
