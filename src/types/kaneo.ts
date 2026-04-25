// src/types/kaneo.ts
import { operations } from "./schema";

export type ProjectRequest =
  operations["createProject"]["requestBody"]["content"]["application/json"];
export type ProjectResponse =
  operations["getProject"]["responses"]["200"]["content"]["application/json"];
export type TaskRequest =
  operations["createTask"]["requestBody"]["content"]["application/json"];
export type TaskResponse =
  operations["createTask"]["responses"]["200"]["content"]["application/json"];
