import { S3Client, ListBucketsCommand, HeadBucketCommand } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";

dotenv.config();

const REGION = process.env.AWS_REGION as string;
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID as string;
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY as string;

export const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});