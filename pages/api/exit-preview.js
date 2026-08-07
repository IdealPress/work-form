import { exitPreview } from "@prismicio/next/pages";

export default async function handler(req, res) {
  await exitPreview({ res, req });
}
