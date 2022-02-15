import { Router } from "express";
import asyncWrapper from "../utilities/async-wrapper";
import Service from "../services";
import validator from "../middleware/validator";
import config from "../keys";

const service = new Service();
const router = Router();

/** @route   GET /
 *  @desc    Get Root
 *  @access  Public
 */
router.get(
  "/",
  asyncWrapper(async (req, res) => {
    res.send({
      message: "opensear is listening!",
      maintainer: "https://github.com/Niweera",
      source: "https://github.com/Niweera/opensear",
    });
  })
);

/** @route   GET /callback
 *  @desc    Get CRC Check
 *  @access  Public
 */
router.get(
  `/${config.CALLBACK_NONCE}`,
  asyncWrapper(async (req, res) => {
    res.send(service.getHandler(req.query));
  })
);

/** @route   POST /callback
 *  @desc    Receive Twitter events
 *  @access  Public
 */
router.post(
  `/${config.CALLBACK_NONCE}`,
  [validator("Main", "post")],
  asyncWrapper(async (req, res) => {
    res.send(await service.postHandler(req.body));
  })
);

export default router;
