import { Router } from "express";
import { getSidebarHandler } from "../controllers/sidebar.controller";

const router = Router();

router.get("/", getSidebarHandler);

export default router;