import { Router } from "express";
import {
  createProjectHandler,
  getProjectsHandler,
} from "../controllers/project.controller";

const router = Router();

router.post("/", createProjectHandler);

router.get("/", getProjectsHandler);

export default router;