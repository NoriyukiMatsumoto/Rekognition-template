// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  DetectCustomLabelsCommand,
  DetectCustomLabelsCommandInput,
} from "@aws-sdk/client-rekognition";
import type { NextApiRequest, NextApiResponse } from "next";
import { AWSClients } from "../../config/awsv3";

export type Data = { labels: string[] }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const img = req.body.img;
  if (req.method == "POST") {
    const AWS = new AWSClients();
    const buffer = Buffer.from(img, "base64");


    try {
      const detectCustomLabelsParams: DetectCustomLabelsCommandInput = {
        ProjectVersionArn: "",
        Image: {
          Bytes: buffer,
        },
      };

      const data = await AWS.rekognitionClient.send(
        new DetectCustomLabelsCommand(detectCustomLabelsParams)
      );

      console.log(data.CustomLabels);

      const labels = data.CustomLabels?.map(label => String(label)) ?? []

      res.status(200).send({ labels });
      return;
    } catch (err) {
      console.error(err);
      res.status(500);
      return;
    }
  }
  res.status(404);
}
