import { TaskRequest, TaskResponse } from "../types/kaneo";
import { Kaneo } from "../core/Kaneo";

export class Task {
  constructor(private kaneo: Kaneo) { }

  async list(projectId: string, params?: any): Promise<TaskResponse[]> {
    const response = await this.kaneo.client.get<any>(
      `/task/tasks/${projectId}`,
      {
        params,
      },
    );
    return response.data.data || response.data;
  }

  async create(projectId: string, data: TaskRequest): Promise<TaskResponse> {
    const response = await this.kaneo.client.post<any>(
      `/task/${projectId}`,
      data,
    );
    return response.data.data || response.data;
  }

  async get(id: string): Promise<TaskResponse> {
    const response = await this.kaneo.client.get<any>(`/task/${id}`);
    return response.data.data || response.data;
  }

  async update(id: string, data: Partial<TaskRequest>): Promise<TaskResponse> {
    const response = await this.kaneo.client.put<any>(`/task/${id}`, data);
    return response.data.data || response.data;
  }

  async deleteTask(id: string): Promise<void> {
    await this.kaneo.client.delete(`/task/${id}`);
  }
}
