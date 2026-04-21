import { AxiosInstance } from 'axios';
import { ProjectRequest, ProjectResponse } from '../types/kaneo';

export class Project {
  constructor(private client: AxiosInstance, private workspaceId: string) {}

  async list(): Promise<ProjectResponse[]> {
    const response = await this.client.get<any>('/project', {
      params: { workspaceId: this.workspaceId },
    });
    return response.data.data || response.data;
  }

  async create(data: ProjectRequest): Promise<ProjectResponse> {
    const response = await this.client.post<any>('/project', data);
    return response.data.data || response.data;
  }

  async get(id: string): Promise<ProjectResponse> {
    const response = await this.client.get<any>(`/project/${id}`);
    return response.data.data || response.data;
  }

  async update(id: string, data: Partial<ProjectRequest>): Promise<ProjectResponse> {
    const response = await this.client.put<any>(`/project/${id}`, data);
    return response.data.data || response.data;
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(`/project/${id}`);
  }

  async archive(id: string): Promise<ProjectResponse> {
    const response = await this.client.put<any>(`/project/${id}/archive`);
    return response.data.data || response.data;
  }
}
