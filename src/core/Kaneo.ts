import axios, { AxiosInstance } from 'axios';
import { KaneoConfig } from '../types/kaneo';
import { Project } from './Project';
import { Task } from './Task';

export class Kaneo {
  private client: AxiosInstance;
  public project: Project;
  public task: Task;

  constructor(config: KaneoConfig) {
    const baseUrl = config.host.endsWith('/') ? config.host.slice(0, -1) : config					
    
    this.client = axios.create({
      baseURL: `${baseUrl}/api`,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    this.project = new Project(this.client, config.workspaceId!);
    this.task = new Task(this.client, config.workspaceId!);
  }
}
