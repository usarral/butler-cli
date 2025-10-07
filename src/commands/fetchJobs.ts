import { jenkins } from "../utils/jenkinsClient";
import { saveJobs } from "../utils/storage";

export async function fetchJobs() {
  const res = await jenkins.get("/api/json");
  const jobs = res.data.jobs.map((job: any) => job.name);
  await saveJobs(jobs);
  console.log("✅ Jobs guardados para sugerencias futuras.");
}
