import { promises as fs } from "fs";
import path from "path";

const JOBS_FILE = path.resolve(__dirname, "../../data/jobs.json");

/**
 * Guarda los nombres de los jobs en un archivo local.
 */
export async function saveJobs(jobs: string[]): Promise<void> {
  const data = { jobs };
  await fs.mkdir(path.dirname(JOBS_FILE), { recursive: true });
  await fs.writeFile(JOBS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Recupera los nombres de los jobs guardados.
 */
export async function loadJobs(): Promise<string[]> {
  try {
    const content = await fs.readFile(JOBS_FILE, "utf-8");
    const data = JSON.parse(content);
    return data.jobs || [];
  } catch (error) {
    return [];
  }
}
