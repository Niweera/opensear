import ImageService from "./image-service";

test("imageService", async () => {
  const imageService = new ImageService();
  await imageService.removeWatermark("1491661057651183617");
}, 60000);
