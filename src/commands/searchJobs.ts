import { findJobsByName } from "../utils/jenkinsFolder";
import chalk from "chalk";

export async function searchJobs(searchTerm: string) {
  try {
    console.log(`🔍 Buscando jobs que contengan: ${chalk.cyan(searchTerm)}`);
    
    const matchingJobs = await findJobsByName(searchTerm);
    
    if (matchingJobs.length === 0) {
      console.log(chalk.yellow(`⚠️  No se encontraron jobs que contengan "${searchTerm}".`));
      return;
    }
    
    console.log(`\n📋 Jobs encontrados (${chalk.green(matchingJobs.length)}):`);
    console.log("==================================");
    
    matchingJobs.forEach(job => {
      const indent = "  ".repeat(job.level);
      const status = getJobStatus(job.color);
      
      // Destacar el término de búsqueda en el nombre
      const highlightedName = highlightSearchTerm(job.name, searchTerm);
      const highlightedFullName = highlightSearchTerm(job.fullName, searchTerm);
      
      console.log(`${indent}🔹 ${highlightedName}${status}`);
      
      if (job.fullName !== job.name) {
        console.log(`${indent}   📁 ${chalk.gray(highlightedFullName)}`);
      }
    });
    
    // Agrupar por carpetas padre si hay muchos resultados
    if (matchingJobs.length > 10) {
      console.log("\n📊 Resumen por carpetas:");
      const folderGroups = groupJobsByParentFolder(matchingJobs);
      
      Object.entries(folderGroups).forEach(([folder, count]) => {
        console.log(`   📁 ${chalk.blue(folder || "Raíz")}: ${chalk.green(count)} jobs`);
      });
    }
    
  } catch (error: any) {
    console.error(chalk.red(`❌ Error: ${error.message}`));
  }
}

function getJobStatus(color?: string): string {
  if (!color) return "";
  
  switch (color) {
    case 'blue':
      return chalk.green(" ✓");
    case 'red':
      return chalk.red(" ✗");
    case 'yellow':
      return chalk.yellow(" ⚠");
    case 'grey':
    case 'disabled':
      return chalk.gray(" ⚪");
    case 'aborted':
      return chalk.red(" 🚫");
    case 'blue_anime':
      return chalk.cyan(" 🔄");
    case 'red_anime':
      return chalk.red(" 🔄");
    case 'yellow_anime':
      return chalk.yellow(" 🔄");
    default:
      return "";
  }
}

function highlightSearchTerm(text: string, searchTerm: string): string {
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, chalk.bgYellow.black('$1'));
}

function groupJobsByParentFolder(jobs: any[]): Record<string, number> {
  const groups: Record<string, number> = {};
  
  jobs.forEach(job => {
    const parts = job.fullName.split('/');
    const parentFolder = parts.length > 1 ? parts.slice(0, -1).join('/') : '';
    groups[parentFolder] = (groups[parentFolder] || 0) + 1;
  });
  
  return groups;
}