import { getJobParameters, buildJob, getJobInfo } from "../utils/jenkinsFolder";
import chalk from "chalk";
import inquirer from "inquirer";

export async function build(jobName: string, options: { params?: string }) {
  try {
    console.log(`🔨 Preparando build del job: ${chalk.cyan(jobName)}\n`);
    
    // Verificar que el job existe y es ejecutable
    const jobInfo = await getJobInfo(jobName);
    
    if (!jobInfo.buildable) {
      console.error(chalk.red(`❌ El job "${jobName}" no es ejecutable.`));
      process.exit(1);
    }
    
    // Obtener los parámetros del job
    const parameters = await getJobParameters(jobName);
    
    let buildParams: { [key: string]: any } = {};
    
    if (parameters.length > 0) {
      console.log(chalk.blue("📋 Este job requiere parámetros:\n"));
      
      // Si se pasaron parámetros por CLI
      if (options.params) {
        buildParams = parseCliParams(options.params);
        console.log(chalk.green("✓ Usando parámetros proporcionados por CLI\n"));
      } else {
        // Modo interactivo: preguntar por cada parámetro
        buildParams = await promptForParameters(parameters);
      }
    } else {
      console.log(chalk.gray("ℹ️  Este job no requiere parámetros.\n"));
    }
    
    // Confirmar antes de ejecutar
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: '¿Confirmas que quieres ejecutar este build?',
        default: true,
      },
    ]);
    
    if (!confirm) {
      console.log(chalk.yellow("\n🚫 Build cancelado."));
      return;
    }
    
    // Ejecutar el build
    console.log(chalk.cyan("\n🚀 Iniciando build...\n"));
    const result = await buildJob(jobName, buildParams);
    
    console.log(chalk.green("✅ " + result.message));
    
    if (result.queueUrl) {
      console.log(chalk.gray(`📍 Queue URL: ${result.queueUrl}`));
    }
    
    console.log(chalk.blue(`\n💡 Puedes ver el estado del build en: ${jobInfo.url}`));
    
  } catch (error: any) {
    console.error(chalk.red(`❌ Error: ${error.message}`));
    process.exit(1);
  }
}

/**
 * Solicita al usuario los valores para cada parámetro de forma interactiva
 */
async function promptForParameters(
  parameters: Array<{
    name: string;
    type: string;
    description?: string;
    defaultValue?: any;
    choices?: string[];
  }>
): Promise<{ [key: string]: any }> {
  const questions = parameters.map((param) => {
    const question: any = {
      name: param.name,
      message: param.description || param.name,
      default: param.defaultValue,
    };
    
    // Elegir el tipo de prompt según el tipo de parámetro
    switch (param.type) {
      case 'boolean':
        question.type = 'confirm';
        break;
      
      case 'choice':
        question.type = 'list';
        question.choices = param.choices || [];
        break;
      
      case 'password':
        question.type = 'password';
        break;
      
      case 'text':
        question.type = 'editor';
        break;
      
      default:
        question.type = 'input';
    }
    
    return question;
  });
  
  const answers = await inquirer.prompt(questions);
  return answers;
}

/**
 * Parsea parámetros pasados por CLI en formato key=value,key2=value2
 */
function parseCliParams(paramsString: string): { [key: string]: any } {
  const params: { [key: string]: any } = {};
  
  const pairs = paramsString.split(',');
  for (const pair of pairs) {
    const [key, ...valueParts] = pair.split('=');
    const value = valueParts.join('='); // Por si el valor contiene '='
    
    if (key && value !== undefined) {
      // Intentar convertir valores booleanos
      if (value.toLowerCase() === 'true') {
        params[key.trim()] = true;
      } else if (value.toLowerCase() === 'false') {
        params[key.trim()] = false;
      } else {
        params[key.trim()] = value.trim();
      }
    }
  }
  
  return params;
}
