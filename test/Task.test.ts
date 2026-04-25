import { describe, it, expect, vi, beforeEach } from "vitest";
import { Kaneo } from "../src";
import { Task } from "../src/modules/Task";
import axios from "axios";
import dotenv from "dotenv";
import { TaskRequest, TaskResponse } from "../src/types/kaneo";

dotenv.config({ path: ".env.test" });

vi.mock("axios");

describe("Task Module", () => {
  let kaneo: Kaneo;
  let task: Task;
  let mockClient: any;

  const PROJECT_ID = "proj-001";
  const TASK_ID = "task-001";
  const HOST = "http://api.kaneo.app/";
  const API_KEY = "test-api-key";

  beforeEach(() => {
    // Setup mock axios instance
    mockClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };
    (axios.create as any).mockReturnValue(mockClient);

    kaneo = new Kaneo(HOST, API_KEY);
    task = kaneo.task;
  });

  const createMockResponse = (data: any) => ({
    data: { data },
  });

  describe("list()", () => {
    it("should call GET /task/tasks/:projectId", async () => {
      const mockTasks = [{ id: TASK_ID, title: "Test Task", status: "todo" }];
      mockClient.get.mockResolvedValueOnce(createMockResponse(mockTasks));

      const result = await task.list(PROJECT_ID);

      expect(mockClient.get).toHaveBeenCalledWith(`/task/tasks/${PROJECT_ID}`, {
        params: undefined,
      });
      expect(result).toEqual(mockTasks);
    });

    it("should include params when provided", async () => {
      const mockTasks = [{ id: TASK_ID, title: "Task 1" }];
      mockClient.get.mockResolvedValueOnce(createMockResponse(mockTasks));

      const params = { status: "in-progress" };
      await task.list(PROJECT_ID, params);

      expect(mockClient.get).toHaveBeenCalledWith(`/task/tasks/${PROJECT_ID}`, {
        params,
      });
    });

    it("should return all tasks for a project", async () => {
      const mockTasks = [
        { id: "t1", title: "Task 1", status: "todo" },
        { id: "t2", title: "Task 2", status: "in-progress" },
        { id: "t3", title: "Task 3", status: "done" },
      ];
      mockClient.get.mockResolvedValueOnce(createMockResponse(mockTasks));

      const result = await task.list(PROJECT_ID);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe("t1");
      expect(result[2].id).toBe("t3");
    });

    it("should return empty array for project with no tasks", async () => {
      mockClient.get.mockResolvedValueOnce(createMockResponse([]));

      const result = await task.list(PROJECT_ID);

      expect(result).toEqual([]);
      expect(mockClient.get).toHaveBeenCalledTimes(1);
    });

    it("should throw on API error", async () => {
      mockClient.get.mockRejectedValueOnce(new Error("Not Found"));

      await expect(task.list("invalid")).rejects.toThrow("Not Found");
    });
  });

  describe("create()", () => {
    it("should call POST /task/:projectId", async () => {
      const data: TaskRequest = { title: "New Task", status: "todo" } as any;
      const mockResponse: TaskResponse = { id: "new-task", ...data } as any;
      mockClient.post.mockResolvedValueOnce(createMockResponse(mockResponse));

      const result = await task.create(PROJECT_ID, data);

      expect(mockClient.post).toHaveBeenCalledWith(`/task/${PROJECT_ID}`, data);
      expect(result.title).toBe("New Task");
    });

    it("should preserve all task fields on creation", async () => {
      const data: TaskRequest = {
        title: "Full Task",
        description: "task description",
        priority: 1,
        status: "todo",
      } as any;
      const mockResponse: TaskResponse = { id: "new-task", ...data } as any;
      mockClient.post.mockResolvedValueOnce(createMockResponse(mockResponse));

      const result = await task.create(PROJECT_ID, data);

      expect(result.title).toBe("Full Task");
      expect(result.description).toBe("task description");
      expect(result.priority).toBe(1);
      expect(result.status).toBe("todo");
    });

    it("should throw on creation failure", async () => {
      mockClient.post.mockRejectedValueOnce(new Error("Validation Error"));

      const badData: any = {};
      await expect(task.create(PROJECT_ID, badData)).rejects.toThrow(
        "Validation Error",
      );
    });
  });

  describe("get()", () => {
    it("should call GET /task/:id", async () => {
      const mockTask = { id: TASK_ID, title: "Test Task", status: "todo" };
      mockClient.get.mockResolvedValueOnce(createMockResponse(mockTask));

      const result = await task.get(TASK_ID);

      expect(mockClient.get).toHaveBeenCalledWith(`/task/${TASK_ID}`);
      expect(result.id).toBe(TASK_ID);
      expect(result.title).toBe("Test Task");
    });

    it("should throw when task not found", async () => {
      mockClient.get.mockRejectedValueOnce({ response: { status: 404 } });

      await expect(task.get("nonexistent")).rejects.toThrow();
    });
  });

  describe("update()", () => {
    it("should call PUT /task/:id with partial data", async () => {
      const mockTask = {
        id: TASK_ID,
        title: "Updated Title",
        status: "in-progress",
      };
      mockClient.put.mockResolvedValueOnce(createMockResponse(mockTask));

      const result = await task.update(TASK_ID, { title: "Updated Title" });

      expect(mockClient.put).toHaveBeenCalledWith(`/task/${TASK_ID}`, {
        title: "Updated Title",
      });
      expect(result.title).toBe("Updated Title");
    });

    it("should update multiple fields at once", async () => {
      const update: Partial<TaskRequest> = {
        title: "Updated Task",
        description: "new description",
        status: "in-progress",
        priority: "low",
      };
      const mockTask = { id: TASK_ID, ...update };
      mockClient.put.mockResolvedValueOnce(createMockResponse(mockTask));

      const result = await task.update(TASK_ID, update);

      expect(mockClient.put).toHaveBeenCalledWith(`/task/${TASK_ID}`, update);
      expect(result.status).toBe("in-progress");
      expect(result.priority).toBe("low");
    });
  });

  describe("deleteTask()", () => {
    it("should call DELETE /task/:id", async () => {
      mockClient.delete.mockResolvedValueOnce({ data: {} });

      await task.deleteTask(TASK_ID);

      expect(mockClient.delete).toHaveBeenCalledWith(`/task/${TASK_ID}`);
    });

    it("should not return any data", async () => {
      mockClient.delete.mockResolvedValueOnce({ data: undefined });

      const result = await task.deleteTask(TASK_ID);

      expect(result).toBeUndefined();
    });

    it("should throw on deletion failure", async () => {
      mockClient.delete.mockRejectedValueOnce(new Error("Forbidden"));

      await expect(task.deleteTask("forbidden-task")).rejects.toThrow(
        "Forbidden",
      );
    });
  });
});
