import { getLastBuild, getJobInfo } from "../utils/jenkinsFolder";
import chalk from "chalk";

export async function lastBuild(jobName: string) {
  try {
    console.log(`🔍 Obteniendo último build del job: ${chalk.cyan(jobName)}`);
    
    const { jobData, buildData } = await validateAndGetBuildData(jobName);
    
    displayBuildHeader(jobData, buildData, jobName);
    displayBuildTiming(buildData);
    displayBuildCauses(buildData);
    
  } catch (error: any) {
    console.error(chalk.red(`❌ Error: ${error.message}`));
  }
}

async function validateAndGetBuildData(jobName: string) {
  const jobData = await getJobInfo(jobName);
  
  if (!jobData.buildable) {
    throw new Error(`El job "${jobName}" no es ejecutable (puede ser una carpeta o estar deshabilitado).`);
  }
  
  if (!jobData.lastBuild) {
    throw new Error(`El job "${jobName}" no tiene builds ejecutados.`);
  }
  
  const buildData = await getLastBuild(jobName);
  return { jobData, buildData };
}

function displayBuildHeader(jobData: any, buildData: any, jobName: string) {
  console.log("\n🏗️  Información del Último Build:");
  console.log("=================================");
  console.log(`${chalk.bold("Job:")} ${jobData.fullName || jobName}`);
  console.log(`${chalk.bold("Número de build:")} #${buildData.number}`);
  console.log(`${chalk.bold("URL:")} ${buildData.url}`);
  
  const result = buildData.result;
  if (result) {
    console.log(`${chalk.bold("Resultado:")} ${getBuildResultDisplay(result)}`);
  } else {
    console.log(`${chalk.bold("Estado:")} ${chalk.cyan("🔄 En ejecución")}`);
  }
}

function displayBuildTiming(buildData: any) {
  if (buildData.duration && buildData.duration > 0) {
    const durationMinutes = Math.floor(buildData.duration / 60000);
    const durationSeconds = Math.floor((buildData.duration % 60000) / 1000);
    console.log(`${chalk.bold("Duración:")} ${durationMinutes}m ${durationSeconds}s`);
  }
  
  if (buildData.timestamp) {
    const startTime = new Date(buildData.timestamp);
    console.log(`${chalk.bold("Iniciado:")} ${startTime.toLocaleString()}`);
    
    if (buildData.duration && buildData.duration > 0) {
      const endTime = new Date(buildData.timestamp + buildData.duration);
      console.log(`${chalk.bold("Finalizado:")} ${endTime.toLocaleString()}`);
    }
  }
  
  if (!buildData.result && buildData.estimatedDuration) {
    const estimatedMinutes = Math.floor(buildData.estimatedDuration / 60000);
    console.log(`${chalk.bold("Duración estimada:")} ~${estimatedMinutes}m`);
  }
}

function displayBuildCauses(buildData: any) {
  if (!buildData.actions) return;
  
  const causes = buildData.actions
    .filter((action: any) => action._class?.includes("CauseAction"))
    .flatMap((action: any) => action.causes || []);
  
  if (causes.length > 0) {
    console.log(`${chalk.bold("Iniciado por:")}`);
    causes.forEach((cause: any) => {
      console.log(`   • ${getCauseDisplay(cause)}`);
    });
  }
}

function getBuildResultDisplay(result: string): string {
  switch (result) {
    case 'SUCCESS':
      return chalk.green("✅ Exitoso");
    case 'FAILURE':
      return chalk.red("❌ Fallido");
    case 'UNSTABLE':
      return chalk.yellow("⚠️ Inestable");
    case 'ABORTED':
      return chalk.red("🚫 Abortado");
    case 'NOT_BUILT':
      return chalk.gray("⏭️ No construido");
    default:
      return chalk.gray(result);
  }
}

function getCauseDisplay(cause: any): string {
  const className = cause._class || "";
  
  if (className.includes("UserIdCause")) {
    return `👤 Usuario: ${cause.userId || "Desconocido"}`;
  }
  if (className.includes("TimerTriggerCause")) {
    return "⏰ Programación temporal";
  }
  if (className.includes("SCMTriggerCause")) {
    return "🔄 Cambio en repositorio";
  }
  if (className.includes("UpstreamCause")) {
    return `⬆️ Build padre: ${cause.upstreamProject}#${cause.upstreamBuild}`;
  }
  if (className.includes("BranchEventCause")) {
    return `🌿 Evento de rama: ${cause.origin || "Desconocido"}`;
  }
  
  return cause.shortDescription || "Causa desconocida";
}