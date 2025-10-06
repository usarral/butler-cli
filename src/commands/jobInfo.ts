import { jenkins } from "../utils/jenkinsClient";

export async function jobInfo(jobName: string) {
  const res = await jenkins.get(`/job/${jobName}/api/json`);
  console.log(`📄 Job: ${res.data.name}`);
  console.log(`🔁 Última ejecución: ${res.data.lastBuild?.number}`);
  console.log(`📦 Descripción: ${res.data.description || "Sin descripción"}`);
}
