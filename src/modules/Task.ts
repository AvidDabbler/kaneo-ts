import { AxiosInstance } from 'axios';
import { TaskRequest, TaskResponse } from '../types/kaneo';

export class Task {
  constructor(private client: AxiosInstance, private workspaceId: string) {}

  async list(projectId: string, params?: any): Promise<TaskResponse[]> {
    const response = await this.client.get<any>(`/task/tasks/${projectId}`, { params });
    return response.data.data || response.data;
  }

  async create(projectId: string, data: TaskRequest): Promise<TaskResponse> {
    const response = await this.client.post<any>(`/task/${projectId}`, data);
    return response.data.data || response.data;
  }

  async get(id: string): Promise<TaskResponse> {
    const response = async await this.client.get<any>(`/task/${id}`);
    return response.data.data || response.data;
  }

  async update(id: string, data: Partial<TaskRequest>): Promise<TaskResponse> {
    const response = await this.client.put<any>(`/task/${id}`, data);
    return response.data.data || response.data;
  }

  async deleteTask(id: string): Promise<void> {
    await this.client.delete(`/task/${id}`);
  }
}
