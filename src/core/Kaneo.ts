import axios, { AxiosInstance } from "axios";
import { Project } from "../modules/Project";
import { Task } from "../modules/Task";

export class Kaneo {
  client: AxiosInstance;
  public project: Project;
  public task: Task;

  constructor(host: string, apiKey: string) {
    if (host == "") {
      throw Error("host is required");
    }
    if (apiKey == "") {
      throw Error("apiKey is required");
    }
    const baseUrl = host.endsWith("/") ? host.slice(0, -1) : null;
    if (baseUrl == null) {
      throw Error("host must end with '/'");
    }

    this.client = axios.create({
      baseURL: `${baseUrl}/api`,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    this.project = new Project(this);
    this.task = new Task(this);
  }
}
