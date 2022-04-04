import express from "express";

import FetchHandler from "./fetch";
import DeleteHandler from "./delete";
import UpdateHandler from "./update";

const router = express.Router();

router.use("/fetch", FetchHandler);
router.use("/update", UpdateHandler);
router.use("/delete", DeleteHandler);

export default router;
