import OpenSeaRobot from "./index";
import Xvfb from "xvfb";

const xvfb = new Xvfb();

(async () => {
  xvfb.startSync();
  const openSeaRobot = new OpenSeaRobot();
  await openSeaRobot.run();
  xvfb.stopSync();
})();
