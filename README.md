# kaneo-ts

A TypeScript SDK for interacting with the Kaneo API. This library provides a type-safe way to manage projects and tasks within your Kaneo workspace.

## Installation

```bash
npm install kaneo-ts
# OR
yarn add kaneo-ts
```

## Quick Start

### Initialization

```typescript
import { Kaneo } from 'kaneo-ts';

const kaneo = new Kaneo({
  host: 'https://kaneo-api.claw.local',
  apiKey: 'your-api-key',
  workspaceId: 'your-workspace-id',
});
```

### Managing Projects

```typescript
// List all projects in the workspace
const projects = await kaneo.project.list();

// Create a new project
const newProject = await kaneo.project.create({
  name: 'New Project',
  workspaceId: 'your-workspace-id',
  icon: '🚀',
  slug: 'new-project',
  description: 'A project description',
});

// Get a specific project
const project = await kaneo.project.get('project-id');

// Update a project
await kaneo.project.update('project-id', {
  name: 'Updated Project Name',
});

// Archive a project
await kaneo.project.archive('project-id');

// Delete a project
await kaneo.project.delete('project-id');
```

### Managing Tasks

```typescript
// List tasks for a specific project
const tasks = await kaneo.task.list('project-id');

// Create a new task
const newTask = await kaneo.task.create('project-id', {
  title: 'Implement SDK README',
  description: 'Write a comprehensive README for the kaneo-ts repo',
  priority: 'high',
  status: 'todo',
  dueDate: '2026-04-22',
});

// Get a specific task
const task = await kaneo.task.get('task-id');

// Update a task
await kaneo.task.update('task-id', {
  status: 'in-progress',
});

// Delete a task
await kaneo.task.deleteTask('task-id');
```

## API Reference

### `Kaneo` Class
The entry point for the SDK.

- `project`: Instance of the `Project` module.
- `task`: Instance of the `Task` module.

### `Project` Module
- `list()`: Returns an array of projects.
- `create(data: ProjectRequest)`: Creates a new project.
- `get(id: string)`: Fetches a project by ID.
- `update(id: string, data: Partial<ProjectRequest>)`: Updates project details.
- `delete(id: string)`: Permanently deletes a project.
- `archive(id: string)`: Archives a project.

### `Task` Module
- `list(projectId: string, params?: any)`: Returns tasks for a project.
- `create(projectId: string, data: TaskRequest)`: Creates a task within a project.
- `get(id: string)`: Fetches a task by ID.
- `update(id: string, data: Partial<TaskRequest>)`: Updates task details.
- `deleteTask(id: string)`: Deletes a task.

## License

ISC
