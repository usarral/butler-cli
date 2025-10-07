import { getAllJobs } from "../utils/jenkinsFolder";
import { saveJobs } from "../utils/storage";
import chalk from "chalk";

export async function fetchJobs() {
  try {
    console.log("🔍 Obteniendo todos los jobs (incluyendo carpetas)...");
    
    const jobItems = await getAllJobs();
    const jobNames = jobItems.map(job => job.fullName);
    
    await saveJobs(jobNames);
    
    console.log(chalk.green(`✅ ${jobNames.length} jobs guardados para sugerencias futuras.`));
    
    // Mostrar algunos ejemplos de lo que se encontró
    if (jobNames.length > 0) {
      console.log("\n📋 Ejemplos de jobs encontrados:");
      const examples = jobNames.slice(0, 5);
      examples.forEach(name => {
        const parts = name.split('/');
        if (parts.length > 1) {
          console.log(`   📁 ${chalk.blue(parts.slice(0, -1).join('/'))} → ${chalk.white(parts[parts.length - 1])}`);
        } else {
          console.log(`   🔹 ${chalk.white(name)}`);
        }
      });
      
      if (jobNames.length > 5) {
        console.log(`   ... y ${jobNames.length - 5} más`);
      }
    }
    
  } catch (error: any) {
    console.error(chalk.red(`❌ Error: ${error.message}`));
  }
}
