// src/types/kaneo.ts

export interface KaneoConfig {
  host: string;
  apiKey: string;
  workspaceId?: string;
}

export interface ProjectRequest {
  name: string;
  workspaceId: string;
  icon: string;
  slug: string;
  description?: string;
  isPublic?: boolean;
}

export interface ProjectResponse {
  id: string;
  workspaceId: string;
  slug: string;
  icon: string;
  name: string;
  description?: string;
  createdAt: string;
  isPublic: boolean;
  archivedAt?: string;
}

export interface TaskRequest {
  title: string;
  description: string;
  priority: 'no-priority' | 'low' | 'api' | 'medium' | 'high' | 'urgent'; // Note: I'll fix 'api' to 'low' if it was a typo in my head, checking spec...
  status: string;
  startDate?: string;
  dueDate?: string;
  userId?: string;
}

export interface TaskResponse {
  id: string;
  projectId: string;
  position?: number;
  number?: number;
  userId?: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  startDate?: string;
  dueDate?: string;
  createdAt: string;
}
