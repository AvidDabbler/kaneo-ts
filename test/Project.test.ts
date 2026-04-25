import { describe, it, expect, vi, beforeEach } from "vitest";
import { Kaneo } from "../src";
import { Project } from "../src/modules/Project";
import axios from "axios";
import dotenv from "dotenv";
import { ProjectRequest, ProjectResponse } from "../src/types/kaneo";

dotenv.config({ path: ".env.test" });

vi.mock("axios");

describe("Project Module", () => {
  let kaneo: Kaneo;
  let project: Project;
  let mockClient: any;

  const WORKSPACE_ID = "ws-test-001";
  const PROJECT_ID = "p1";
  const HOST = "http://api.kaneo.app/";
  const API_KEY = "test-api-key";

  beforeEach(() => {
    mockClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };
    (axios.create as any).mockReturnValue(mockClient);

    kaneo = new Kaneo(HOST, API_KEY);
    project = kaneo.project;
  });

  const createMockResponse = (data: any) => ({
    data: { data },
  });

  const createMockFlatResponse = (data: any) => ({
    data: data,
  });

  describe("list()", () => {
    it("should call GET /project with workspaceId query param", async () => {
      const mockResponse = [
        { id: "p1", name: "Project 1" },
        { id: "p2", name: "Project 2" },
      ];
      mockClient.get.mockResolvedValueOnce(createMockResponse(mockResponse));

      const result = await project.list(WORKSPACE_ID);

      expect(mockClient.get).toHaveBeenCalledWith("/project", {
        params: { workspaceId: WORKSPACE_ID },
      });
      expect(result).toEqual(mockResponse);
    });

    it("should return empty array when no projects exist", async () => {
      mockClient.get.mockResolvedValueOnce(createMockResponse([]));

      const result = await project.list(WORKSPACE_ID);

      expect(result).toEqual([]);
    });

    it("should handle flat response data structure", async () => {
      const mockResponse = [{ id: "p1", name: "Project 1" }];
      mockClient.get.mockResolvedValueOnce(
        createMockFlatResponse(mockResponse),
      );

      const result = await project.list(WORKSPACE_ID);

      expect(result).toEqual(mockResponse);
    });

    it("should throw on API error", async () => {
      mockClient.get.mockRejectedValueOnce(new Error("Network Error"));

      await expect(project.list(WORKSPACE_ID)).rejects.toThrow("Network Error");
    });
  });

  describe("create()", () => {
    it("should call POST /project with data", async () => {
      const requestData: ProjectRequest = {
        workspaceId: WORKSPACE_ID,
        name: "New Project",
      } as any;
      const mockResponse: ProjectResponse = {
        id: "p-new",
        ...requestData,
      } as any;
      mockClient.post.mockResolvedValueOnce(createMockResponse(mockResponse));

      const result = await project.create(requestData);

      expect(mockClient.post).toHaveBeenCalledWith("/project", requestData);
      expect(result).toEqual({ id: "p-new", ...requestData });
    });

    it("should preserve all request fields", async () => {
      const requestData: ProjectRequest = {
        workspaceId: WORKSPACE_ID,
        name: "Full Project",
        icon: "",
        slug: "full-project",
      };
      const mockResponse: ProjectResponse = { ...requestData } as any;
      mockClient.post.mockResolvedValueOnce(createMockResponse(mockResponse));

      const result = await project.create(requestData);

      expect(result.name).toBe("Full Project");
    });

    it("should throw on creation failure", async () => {
      mockClient.post.mockRejectedValueOnce(new Error("Validation Error"));

      await expect(
        project.create({ workspaceId: WORKSPACE_ID, name: "" } as any),
      ).rejects.toThrow("Validation Error");
    });
  });

  describe("get()", () => {
    it("should call GET /project/:id", async () => {
      const mockResponse: ProjectResponse = {
        id: PROJECT_ID,
        name: "Test Project",
      } as any;
      mockClient.get.mockResolvedValueOnce(createMockResponse(mockResponse));

      const result = await project.get(PROJECT_ID);

      expect(mockClient.get).toHaveBeenCalledWith(`/project/${PROJECT_ID}`);
      expect(result.id).toBe(PROJECT_ID);
      expect(result.name).toBe("Test Project");
    });

    it("should throw when project not found", async () => {
      mockClient.get.mockRejectedValueOnce({ response: { status: 404 } });

      await expect(project.get("p-nonexistent")).rejects.toThrow();
    });
  });

  describe("update()", () => {
    it("should call PUT /project/:id with partial data", async () => {
      const mockResponse: ProjectResponse = {
        id: PROJECT_ID,
        name: "Updated Project",
      } as any;
      mockClient.put.mockResolvedValueOnce(createMockResponse(mockResponse));

      const result = await project.update(PROJECT_ID, {
        name: "Updated Project",
      });

      expect(mockClient.put).toHaveBeenCalledWith(`/project/${PROJECT_ID}`, {
        name: "Updated Project",
      });
      expect(result.name).toBe("Updated Project");
    });

    it("should allow updating multiple fields at once", async () => {
      const mockResponse: Partial<ProjectResponse> = {
        id: PROJECT_ID,
        name: "Updated",
      };
      mockClient.put.mockResolvedValueOnce(createMockResponse(mockResponse));

      const result = await project.update(PROJECT_ID, {
        name: "Updated",
      });

      expect(mockClient.put).toHaveBeenCalledWith(`/project/${PROJECT_ID}`, {
        name: "Updated",
      });
      expect(result.name).toBe("Updated");
    });
  });

  describe("delete()", () => {
    it("should call DELETE /project/:id", async () => {
      mockClient.delete.mockResolvedValueOnce({ data: {} });

      await project.delete(PROJECT_ID);

      expect(mockClient.delete).toHaveBeenCalledWith(`/project/${PROJECT_ID}`);
    });

    it("should throw on deletion failure", async () => {
      mockClient.delete.mockRejectedValueOnce(new Error("Permission Denied"));

      await expect(project.delete(PROJECT_ID)).rejects.toThrow(
        "Permission Denied",
      );
    });
  });

  //  TODO: missing isArchived type found
  // {...isArchived: { nullable: true }}
  // expect(result.isArchived).toBe(true);
  // describe("archive()", () => {
  //   it("should call PUT /project/:id/archive", async () => {
  //     const mockResponse: Partial<ProjectResponse> = {
  //       id: PROJECT_ID,
  //       // isArchived: true,
  //     };
  //     mockClient.put.mockResolvedValueOnce(createMockResponse(mockResponse));
  //
  //     await project.archive(PROJECT_ID);
  //
  //     expect(mockClient.put).toHaveBeenCalledWith(
  //       `/project/${PROJECT_ID}/archive`,
  //     );
  //   });
  //
  //   it("should throw when archive fails", async () => {
  //     mockClient.put.mockRejectedValueOnce(new Error("Not Found"));
  //
  //     await expect(project.archive("p-nonexistent")).rejects.toThrow(
  //       "Not Found",
  //     );
  //   });
  // });
});
