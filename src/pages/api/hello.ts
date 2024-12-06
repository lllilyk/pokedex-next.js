import dbConnect from "../../lib/db";
import Pokemon from "../../models/Pokemon"
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
  ) {
  await dbConnect();
  await Pokemon.create({ name: "pikachu", image: "pikachu.png" });
  
  if (req.method === "GET") {
    res.status(200).json({ name: "John Doe" });
  }
  return res.status(405).json({ name: "Method Not Allowed" });
}
