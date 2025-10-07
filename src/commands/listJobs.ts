import { getAllJobsRecursive, JobTreeItem } from "../utils/jenkinsFolder";
import chalk from "chalk";

export async function listJobs(options?: { showFolders?: boolean; maxLevel?: number }) {
  try {
    console.log("🔍 Obteniendo estructura de Jenkins...");
    
    const items = await getAllJobsRecursive();
    
    if (items.length === 0) {
      console.log(chalk.yellow("⚠️  No se encontraron jobs o carpetas."));
      return;
    }
    
    // Filtrar por nivel máximo si se especifica
    const filteredItems = options?.maxLevel !== undefined
      ? items.filter(item => item.level <= options.maxLevel!)
      : items;
    
    // Filtrar carpetas si no se desean mostrar
    const displayItems = options?.showFolders === false 
      ? filteredItems.filter(item => item.type === 'job')
      : filteredItems;
    
    console.log("\n📋 Estructura de Jenkins:");
    console.log("========================");
    
    displayItems.forEach(item => {
      const indent = "  ".repeat(item.level);
      const icon = getItemIcon(item);
      const status = getJobStatus(item.color);
      const displayName = item.type === 'folder' 
        ? chalk.blue.bold(item.name)
        : chalk.white(item.name);
      
      console.log(`${indent}${icon} ${displayName}${status}`);
    });
    
    // Mostrar resumen
    const totalJobs = displayItems.filter(item => item.type === 'job').length;
    const totalFolders = displayItems.filter(item => item.type === 'folder').length;
    
    console.log("\n📊 Resumen:");
    console.log(`   Jobs: ${chalk.green(totalJobs)}`);
    if (options?.showFolders !== false) {
      console.log(`   Carpetas: ${chalk.blue(totalFolders)}`);
    }
    
  } catch (error: any) {
    console.error(chalk.red(`❌ Error: ${error.message}`));
  }
}

function getItemIcon(item: JobTreeItem): string {
  if (item.type === 'folder') {
    return "📁";
  }
  
  // Iconos según el estado del job
  switch (item.color) {
    case 'blue':
      return "✅";
    case 'red':
      return "❌";
    case 'yellow':
      return "⚠️";
    case 'grey':
    case 'disabled':
      return "⚪";
    case 'aborted':
      return "🚫";
    case 'blue_anime':
    case 'red_anime':
    case 'yellow_anime':
      return "🔄";
    default:
      return "🔹";
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
