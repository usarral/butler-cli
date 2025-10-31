import { getJobParameters } from "../utils/jenkinsFolder";
import chalk from "chalk";

export async function jobParams(jobName: string) {
  try {
    console.log(`🔍 Obteniendo parámetros del job: ${chalk.cyan(jobName)}`);
    
    const parameters = await getJobParameters(jobName);
    
    if (parameters.length === 0) {
      console.log(chalk.yellow("\n⚠️  Este job no tiene parámetros configurados."));
      return;
    }
    
    console.log("\n📋 Parámetros del Job:");
    console.log("======================");
    
    for (const param of parameters) {
      console.log(`\n${chalk.bold.blue(param.name)} ${chalk.gray(`(${param.type})`)}`);
      
      if (param.description) {
        console.log(`  ${chalk.gray(param.description)}`);
      }
      
      if (param.defaultValue !== undefined) {
        const displayValue = typeof param.defaultValue === 'boolean' 
          ? (param.defaultValue ? chalk.green('true') : chalk.red('false'))
          : chalk.yellow(param.defaultValue);
        console.log(`  ${chalk.bold("Default:")} ${displayValue}`);
      }
      
      if (param.choices && param.choices.length > 0) {
        console.log(`  ${chalk.bold("Opciones:")} ${param.choices.join(", ")}`);
      }
    }
    
  } catch (error: any) {
    console.error(chalk.red(`❌ Error: ${error.message}`));
    process.exit(1);
  }
}
