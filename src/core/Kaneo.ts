import axios, { AxiosInstance } from "axios";
import { KaneoConfig } from "../types/kaneo";
import { Project } from "../modules/Project";
import { Task } from "../modules/Task";

export class Kaneo {
  client: AxiosInstance;
  public project: Project;
  public task: Task;

  constructor(config: KaneoConfig) {
    const baseUrl = config.host.endsWith("/")
      ? config.host.slice(0, -1)
      : config;

    this.client = axios.create({
      baseURL: `${baseUrl}/api`,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
    });

    this.project = new Project(this);
    this.task = new Task(this);
  }
}
