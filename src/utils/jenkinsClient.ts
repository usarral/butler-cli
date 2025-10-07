import axios from "axios";

const JENKINS_URL = process.env.JENKINS_URL!;
const JENKINS_USER = process.env.JENKINS_USER!;
const JENKINS_TOKEN = process.env.JENKINS_TOKEN!;

export const jenkins = axios.create({
  baseURL: JENKINS_URL,
  auth: {
    username: JENKINS_USER,
    password: JENKINS_TOKEN,
  },
});
