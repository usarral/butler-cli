import { getJenkinsClient } from "./jenkinsClient";

export interface JenkinsJob {
  name: string;
  url: string;
  _class: string;
  fullName?: string;
  color?: string;
}

export interface JenkinsFolder {
  name: string;
  url: string;
  _class: string;
  fullName?: string;
  jobs?: JenkinsJob[];
}

export interface JobTreeItem {
  name: string;
  fullName: string;
  type: 'job' | 'folder';
  url: string;
  level: number;
  color?: string;
}

/**
 * Obtiene todos los items (jobs y carpetas) de forma recursiva
 */
export async function getAllJobsRecursive(path: string = ""): Promise<JobTreeItem[]> {
  const jenkins = getJenkinsClient();
  
  try {
    const url = buildApiUrl(path);
    const response = await jenkins.get(url);
    
    if (!response.data?.jobs) {
      return [];
    }
    
    const items: JobTreeItem[] = [];
    for (const item of response.data.jobs) {
      const processedItems = await processJenkinsItem(item, path);
      items.push(...processedItems);
    }
    
    return items;
  } catch (error: any) {
    console.error(`Error obteniendo items de ${path || 'raíz'}: ${error.message}`);
    return [];
  }
}

/**
 * Construye la URL de la API para un path dado
 */
function buildApiUrl(path: string): string {
  return path ? `/job/${path.replace(/\//g, '/job/')}/api/json` : '/api/json';
}

/**
 * Procesa un item de Jenkins y sus sub-items si es una carpeta
 */
async function processJenkinsItem(item: any, parentPath: string): Promise<JobTreeItem[]> {
  const fullName = parentPath ? `${parentPath}/${item.name}` : item.name;
  const level = parentPath ? parentPath.split('/').length : 0;
  
  const currentItem: JobTreeItem = {
    name: item.name,
    fullName,
    type: isFolder(item._class) ? 'folder' : 'job',
    url: item.url,
    level,
    color: item.color
  };
  
  const items = [currentItem];
  
  if (isFolder(item._class)) {
    const subItems = await getAllJobsRecursive(fullName);
    items.push(...subItems);
  }
  
  return items;
}

/**
 * Obtiene solo los jobs (no carpetas) de forma recursiva
 */
export async function getAllJobs(path: string = ""): Promise<JobTreeItem[]> {
  const allItems = await getAllJobsRecursive(path);
  return allItems.filter(item => item.type === 'job');
}

/**
 * Obtiene información detallada de un job específico por su fullName
 */
export async function getJobInfo(jobFullName: string): Promise<any> {
  const jenkins = getJenkinsClient();
  
  try {
    const jobPath = jobFullName.replace(/\//g, '/job/');
    const response = await jenkins.get(`/job/${jobPath}/api/json`);
    return response.data;
  } catch (error: any) {
    throw new Error(`Error obteniendo información del job ${jobFullName}: ${error.message}`);
  }
}

/**
 * Obtiene el último build de un job específico por su fullName
 */
export async function getLastBuild(jobFullName: string): Promise<any> {
  const jenkins = getJenkinsClient();
  
  try {
    const jobPath = jobFullName.replace(/\//g, '/job/');
    const response = await jenkins.get(`/job/${jobPath}/lastBuild/api/json`);
    return response.data;
  } catch (error: any) {
    throw new Error(`Error obteniendo último build del job ${jobFullName}: ${error.message}`);
  }
}

/**
 * Determina si un item es una carpeta basándose en su clase
 */
function isFolder(itemClass: string): boolean {
  const folderClasses = [
    'com.cloudbees.hudson.plugins.folder.Folder',
    'jenkins.branch.OrganizationFolder',
    'org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject',
    'hudson.model.Folder'
  ];
  
  return folderClasses.includes(itemClass);
}

/**
 * Busca jobs por nombre en toda la estructura de carpetas
 */
export async function findJobsByName(searchTerm: string): Promise<JobTreeItem[]> {
  const allJobs = await getAllJobs();
  return allJobs.filter(job => 
    job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

/**
 * Obtiene la estructura de carpetas hasta un nivel específico
 */
export async function getFolderStructure(maxLevel: number = 2): Promise<JobTreeItem[]> {
  const allItems = await getAllJobsRecursive();
  return allItems.filter(item => item.level <= maxLevel);
}