import { Command } from "commander";
import { fetchJobs } from "./commands/fetchJobs";
import { listJobs } from "./commands/listJobs";
import { jobInfo } from "./commands/jobInfo";
import { lastBuild } from "./commands/lastBuild";

const program = new Command();

program
  .name("jenkins-cli")
  .description("CLI para interactuar con Jenkins")
  .version("1.0.0");

program.command("fetch-jobs").action(fetchJobs);
program.command("list-jobs").action(listJobs);
program
  .command("job-info")
  .argument("<jobName>", "Nombre del job")
  .action(jobInfo);
program
  .command("last-build")
  .argument("<jobName>", "Nombre del job")
  .action(lastBuild);

program.parse();
