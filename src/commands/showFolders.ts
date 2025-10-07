import { getFolderStructure } from "../utils/jenkinsFolder";
import chalk from "chalk";

export async function showFolders(options?: { maxLevel?: number }) {
  try {
    const maxLevel = options?.maxLevel || 3;
    console.log(`🔍 Mostrando estructura de carpetas (máximo ${maxLevel} niveles)...`);
    
    const items = await getFolderStructure(maxLevel);
    const folders = items.filter(item => item.type === 'folder');
    
    if (folders.length === 0) {
      console.log(chalk.yellow("⚠️  No se encontraron carpetas en Jenkins."));
      return;
    }
    
    console.log("\n📁 Estructura de Carpetas:");
    console.log("===========================");
    
    folders.forEach(folder => {
      const indent = "  ".repeat(folder.level);
      console.log(`${indent}📁 ${chalk.blue.bold(folder.name)}`);
      console.log(`${indent}   📍 ${chalk.gray(folder.fullName)}`);
    });
    
    console.log(`\n📊 Total de carpetas: ${chalk.green(folders.length)}`);
    
    // Mostrar estadísticas por nivel
    const levelStats: Record<number, number> = {};
    folders.forEach(folder => {
      levelStats[folder.level] = (levelStats[folder.level] || 0) + 1;
    });
    
    console.log("\n📈 Distribución por niveles:");
    Object.entries(levelStats).forEach(([level, count]) => {
      const levelName = level === '0' ? 'Raíz' : `Nivel ${level}`;
      console.log(`   ${levelName}: ${chalk.green(count)} carpetas`);
    });
    
  } catch (error: any) {
    console.error(chalk.red(`❌ Error: ${error.message}`));
  }
}