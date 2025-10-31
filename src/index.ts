#!/usr/bin/env node

import { Command } from "commander";
import { fetchJobs } from "./commands/fetchJobs";
import { listJobs } from "./commands/listJobs";
import { jobInfo } from "./commands/jobInfo";
import { lastBuild } from "./commands/lastBuild";
import { searchJobs } from "./commands/searchJobs";
import { showFolders } from "./commands/showFolders";
import { jobParams } from "./commands/jobParams";
import { build } from "./commands/build";
import { setupConfigCommands } from "./commands/config";

const program = new Command();

program
  .name("butler-cli")
  .description("CLI para interactuar con Pipelines")
  .version("1.0.0");

// Comandos de configuración
setupConfigCommands(program);

// Comandos existentes de Jenkins
program.command("fetch-jobs").action(fetchJobs);

program
  .command("list-jobs")
  .option("--folders", "Mostrar también las carpetas")
  .option("--max-level <level>", "Nivel máximo de profundidad a mostrar", parseInt)
  .action((options) => {
    listJobs({
      showFolders: options.folders !== false,
      maxLevel: options.maxLevel
    });
  });
program
  .command("show-folders")
  .option("--max-level <level>", "Nivel máximo de profundidad a mostrar", parseInt, 3)
  .description("Mostrar solo la estructura de carpetas de Jenkins")
  .action((options) => {
    showFolders({
      maxLevel: options.maxLevel
    });
  });

program
  .command("search-jobs")
  .argument("<searchTerm>", "Término de búsqueda")
  .description("Buscar jobs por nombre en toda la estructura de Jenkins")
  .action(searchJobs);

program
  .command("job-info")
  .argument("<jobName>", "Nombre del job (puede incluir carpetas: folder/subfolder/job)")
  .action(jobInfo);

program
  .command("last-build")
  .argument("<jobName>", "Nombre del job (puede incluir carpetas: folder/subfolder/job)")
  .action(lastBuild);

program
  .command("job-params")
  .argument("<jobName>", "Nombre del job (puede incluir carpetas: folder/subfolder/job)")
  .description("Mostrar los parámetros requeridos por un job")
  .action(jobParams);

program
  .command("build")
  .argument("<jobName>", "Nombre del job (puede incluir carpetas: folder/subfolder/job)")
  .option("--params <params>", "Parámetros en formato key=value,key2=value2")
  .description("Ejecutar un build de forma asistida")
  .action(build);

program.parse();
