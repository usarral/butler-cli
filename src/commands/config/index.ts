import { Command } from "commander";
import { createConfig } from "./create";
import { listConfigs } from "./list";
import { useConfig } from "./use";
import { deleteConfig } from "./delete";
import { showCurrentConfig } from "./current";
import { editConfigPreferences } from "./edit";

export function setupConfigCommands(program: Command): void {
  const configCommand = program
    .command("config")
    .description("Gestionar configuraciones de Jenkins");

  configCommand
    .command("create")
    .description("Crear una nueva configuración de Jenkins")
    .action(createConfig);

  configCommand
    .command("list")
    .alias("ls")
    .description("Listar todas las configuraciones")
    .action(listConfigs);

  configCommand
    .command("use")
    .argument("<name>", "Nombre de la configuración")
    .description("Establecer una configuración como activa")
    .action(useConfig);

  configCommand
    .command("delete")
    .alias("rm")
    .argument("[name]", "Nombre de la configuración a eliminar")
    .description("Eliminar una configuración")
    .action(deleteConfig);

  configCommand
    .command("current")
    .description("Mostrar la configuración activa")
    .action(showCurrentConfig);

  configCommand
    .command("edit")
    .argument("[name]", "Nombre de la configuración a editar (usa la actual si no se especifica)")
    .description("Editar preferencias de una configuración (editor, visor de logs, etc.)")
    .action(editConfigPreferences);
}