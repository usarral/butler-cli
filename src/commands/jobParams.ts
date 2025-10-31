import { getJobParameters } from "../utils/jenkinsFolder";
import { logger } from "../utils/logger";
import { msg } from "../utils/messages";
import { formatters, printHeader } from "../utils/formatters";

export async function jobParams(jobName: string) {
  try {
    logger.info(`${msg.icons.search} ${msg.info.fetchingParams(formatters.jobName(jobName))}`);
    
    const parameters = await getJobParameters(jobName);
    
    if (parameters.length === 0) {
      logger.warn(`\n${msg.icons.warning}  ${msg.warnings.noParams}`);
      return;
    }
    
    printHeader(`${msg.icons.logs} ${msg.labels.jobParams}`);
    
    for (const param of parameters) {
      console.log(`\n${formatters.info(param.name)} ${formatters.secondary(`(${param.type})`)}`);
      
      if (param.description) {
        console.log(`  ${formatters.secondary(param.description)}`);
      }
      
      if (param.defaultValue !== undefined) {
        console.log(`  ${formatters.title(msg.labels.default)} ${formatters.defaultValue(param.defaultValue)}`);
      }
      
      if (param.choices && param.choices.length > 0) {
        console.log(`  ${formatters.title(msg.labels.options)} ${param.choices.join(", ")}`);
      }
    }
    
  } catch (error: any) {
    logger.error(`${msg.icons.error} ${error.message}`);
    process.exit(1);
  }
}
