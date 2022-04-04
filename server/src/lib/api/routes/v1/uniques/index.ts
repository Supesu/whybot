import express from "express";

import IdHandler from "./id";
import CreateHandler from "./create";
import FetchHandler from "./fetch";

const router = express.Router();

router.use("/fetch", FetchHandler);
router.use("/create", CreateHandler);
router.use("/:id", (req, _res, next) => {
  req.app.locals.id = req.params.id;
  next();
});
router.use("/:id", IdHandler);

export default router;
