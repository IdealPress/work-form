import { exitPreview } from "@prismicio/next";

export default async function handler(req, res) {
  await exitPreview({ res, req });
}
