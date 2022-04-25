import express from "express";

import UniquesHandler from "./uniques";
import AuthHandler from "./auth";

const router = express.Router();

router.use("/uniques", UniquesHandler);
router.use("/auth", AuthHandler)

export default router;
