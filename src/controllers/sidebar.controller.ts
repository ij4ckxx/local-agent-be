import { Request, Response } from "express";
import { getSidebarData } from "../services/sidebar.service";

export async function getSidebarHandler(
  _req: Request,
  res: Response
) {
  try {
    const data = await getSidebarData();

    res.json({
      success: true,
      ...data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}