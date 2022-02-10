import { RequestHandler } from "express";

export default AsyncWrapper;
declare function AsyncWrapper(
  fn: RequestHandler
): (req: any, res: any, next: any) => any;
