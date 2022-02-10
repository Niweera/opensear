import Jimp from "jimp";
import path from "path";
import { fileURLToPath } from "url";

export default class ImageService {
  async removeWatermark(originalScreenshot) {
    const __dirname = path.dirname(
      path.dirname(fileURLToPath(import.meta.url))
    );

    const maskPath = path.resolve(path.join(__dirname, "assets", "mask.png"));

    const baseImage = await Jimp.read(originalScreenshot);
    const maskImage = await Jimp.read(maskPath);

    return baseImage
      .composite(maskImage, 0, 0, {
        mode: Jimp.BLEND_DARKEN,
        opacityDest: 1,
        opacitySource: 1,
      })
      .getBufferAsync(Jimp.AUTO);
  }
}
