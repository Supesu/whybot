import express from "express";

import UniquesHandler from "./uniques";

const router = express.Router();

router.use("/uniques", UniquesHandler);

export default router;
