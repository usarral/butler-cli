import { jenkins } from "../utils/jenkinsClient";

export async function lastBuild(jobName: string) {
  const res = await jenkins.get(`/job/${jobName}/lastBuild/api/json`);
  console.log(`🔢 Build #: ${res.data.number}`);
  console.log(`📅 Fecha: ${new Date(res.data.timestamp).toLocaleString()}`);
  console.log(`✅ Resultado: ${res.data.result}`);
  console.log(`🔗 URL: ${res.data.url}`);
}
