import { Request, Response } from "express";
import { createProject, getProjects } from "../services/project.service";

export async function createProjectHandler(req: Request, res: Response) {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: "Project name is required",
      });
    }

    const project = await createProject(name.trim());

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getProjectsHandler(
  _req: Request,
  res: Response
) {
  try {
    const projects = await getProjects();

    res.json({
      success: true,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}