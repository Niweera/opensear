import { Router } from "express";
import asyncWrapper from "../utilities/async-wrapper";
import Service from "../services";
import validator from "../middleware/validator";

const service = new Service();
const router = Router();

/** @route   GET /
 *  @desc    Get Root
 *  @access  Public
 */
router.get(
  "/",
  asyncWrapper(async (req, res) => {
    res.send({ message: "welcome opensear!" });
  })
);

/** @route   GET /screenshot
 *  @desc    Get Screenshot
 *  @access  Public
 */
router.get(
  "/screenshot",
  asyncWrapper(async (req, res) => {
    const { tweetID, screenshot } = await service.getScreenshot();
    res.writeHead(200, {
      "Content-Disposition": `attachment; filename="${tweetID}.png"`,
      "Content-Type": "image/png",
      "Content-Length": screenshot.length,
    });
    res.end(screenshot);
  })
);

/** @route   GET /metadata
 *  @desc    Get Metadata
 *  @access  Public
 */
router.get(
  "/metadata",
  asyncWrapper(async (req, res) => {
    res.send(await service.getMetadata());
  })
);

/** @route   GET /callback
 *  @desc    Get CRC Check
 *  @access  Public
 */
router.get(
  "/callback",
  asyncWrapper(async (req, res) => {
    res.send(service.getHandler(req.query));
  })
);

/** @route   POST /callback
 *  @desc    Receive Twitter events
 *  @access  Public
 */
router.post(
  "/callback",
  [validator("Main", "post")],
  asyncWrapper(async (req, res) => {
    res.send(await service.postHandler(req.body));
  })
);

export default router;
