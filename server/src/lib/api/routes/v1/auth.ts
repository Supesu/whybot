import express from "express";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { SuccessResponse, BadRequestResponse } from "../../core/ApiResponse";
import asyncHandler from "../../helpers/asyncHandler";

const router = express.Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { email, password }: { email: string; password: string } = req.body;
    const auth = getAuth();

    if (!email || !password)
      await new BadRequestResponse("No email or password provided").send(res);

    await signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredentials) => {
        if (userCredentials.user) {
          const template = {
            api_key: process.env.API_KEY,
          };
          await new SuccessResponse("Authenticated", template).send(res);
        } else {
          await new BadRequestResponse("Something went wrong").send(res);
        }
      })
      .catch(async (_err) => {
        await new BadRequestResponse("Something went wrong (30)").send(res);
      });
  })
);

export default router;
