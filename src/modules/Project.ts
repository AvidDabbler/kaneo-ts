import { ProjectRequest, ProjectResponse } from "../types/kaneo";
import { Kaneo } from "../core/Kaneo";

export class Project {
  constructor(private kaneo: Kaneo) { }

  async list(workspaceId: string): Promise<ProjectResponse[]> {
    const response = await this.kaneo.client.get<any>("/project", {
      params: { workspaceId: workspaceId },
    });
    return response.data.data || response.data;
  }

  async create(data: ProjectRequest): Promise<ProjectResponse> {
    const response = await this.kaneo.client.post<any>("/project", data);
    return response.data.data || response.data;
  }

  async get(id: string): Promise<ProjectResponse> {
    const response = await this.kaneo.client.get<any>(`/project/${id}`);
    return response.data.data || response.data;
  }

  async update(
    id: string,
    data: Partial<ProjectRequest>,
  ): Promise<ProjectResponse> {
    const response = await this.kaneo.client.put<any>(`/project/${id}`, data);
    return response.data.data || response.data;
  }

  async delete(id: string): Promise<void> {
    await this.kaneo.client.delete(`/project/${id}`);
  }

  async archive(id: string): Promise<ProjectResponse> {
    const response = await this.kaneo.client.put<any>(`/project/${id}/archive`);
    return response.data.data || response.data;
  }
}
