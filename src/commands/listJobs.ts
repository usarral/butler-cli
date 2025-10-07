import { jenkins } from "../utils/jenkinsClient";

export async function listJobs() {
  const res = await jenkins.get("/api/json");
  res.data.jobs.forEach((job: any) => {
    console.log(`🔹 ${job.name}`);
  });
}
