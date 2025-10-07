import { getJobInfo } from "../utils/jenkinsFolder";
import chalk from "chalk";

export async function jobInfo(jobName: string) {
  try {
    console.log(`🔍 Obteniendo información del job: ${chalk.cyan(jobName)}`);
    
    const jobData = await getJobInfo(jobName);
    
    console.log("\n📄 Información del Job:");
    console.log("========================");
    console.log(`${chalk.bold("Nombre:")} ${jobData.name}`);
    console.log(`${chalk.bold("Nombre completo:")} ${jobData.fullName || jobName}`);
    console.log(`${chalk.bold("URL:")} ${jobData.url}`);
    console.log(`${chalk.bold("Descripción:")} ${jobData.description || chalk.gray("Sin descripción")}`);
    
    if (jobData.lastBuild) {
      console.log(`${chalk.bold("Último build:")} #${jobData.lastBuild.number}`);
      console.log(`${chalk.bold("URL último build:")} ${jobData.lastBuild.url}`);
    } else {
      console.log(`${chalk.bold("Último build:")} ${chalk.gray("Ninguno")}`);
    }
    
    if (jobData.lastSuccessfulBuild) {
      console.log(`${chalk.bold("Último build exitoso:")} #${jobData.lastSuccessfulBuild.number}`);
    }
    
    if (jobData.lastFailedBuild) {
      console.log(`${chalk.bold("Último build fallido:")} #${jobData.lastFailedBuild.number}`);
    }
    
    // Información adicional para MultibranchPipeline o carpetas
    if (jobData._class?.includes("MultiBranchProject") || jobData._class?.includes("Folder")) {
      console.log(`${chalk.bold("Tipo:")} ${getJobTypeDisplay(jobData._class)}`);
      
      if (jobData.jobs && jobData.jobs.length > 0) {
        console.log(`${chalk.bold("Sub-items:")} ${jobData.jobs.length}`);
      }
    }
    
    // Estado del job
    if (jobData.color) {
      console.log(`${chalk.bold("Estado:")} ${getJobStatusDisplay(jobData.color)}`);
    }
    
    // Buildable
    console.log(`${chalk.bold("Ejecutable:")} ${jobData.buildable ? chalk.green("Sí") : chalk.red("No")}`);
    
  } catch (error: any) {
    console.error(chalk.red(`❌ Error: ${error.message}`));
  }
}

function getJobTypeDisplay(className: string): string {
  if (className.includes("MultiBranchProject")) {
    return chalk.blue("Multi-branch Pipeline");
  }
  if (className.includes("Folder")) {
    return chalk.blue("Carpeta");
  }
  if (className.includes("WorkflowJob")) {
    return chalk.green("Pipeline");
  }
  if (className.includes("FreeStyleProject")) {
    return chalk.yellow("Freestyle");
  }
  return chalk.gray(className);
}

function getJobStatusDisplay(color: string): string {
  switch (color) {
    case 'blue':
      return chalk.green("✅ Exitoso");
    case 'red':
      return chalk.red("❌ Fallido");
    case 'yellow':
      return chalk.yellow("⚠️ Inestable");
    case 'grey':
    case 'disabled':
      return chalk.gray("⚪ Deshabilitado");
    case 'aborted':
      return chalk.red("🚫 Abortado");
    case 'blue_anime':
      return chalk.cyan("🔄 Ejecutándose (exitoso)");
    case 'red_anime':
      return chalk.red("🔄 Ejecutándose (fallido)");
    case 'yellow_anime':
      return chalk.yellow("🔄 Ejecutándose (inestable)");
    default:
      return chalk.gray(color);
  }
}
