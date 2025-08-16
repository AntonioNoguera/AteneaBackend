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



// Verifica que las credenciales funcionan
async function verifyS3() {
  try {
    // 1. Lista buckets de la cuenta
    const buckets = await s3.send(new ListBucketsCommand({}));
    console.log("✅ Buckets disponibles:", buckets.Buckets?.map(b => b.Name));

    // 2. Chequea acceso al bucket específico
    const bucketName = "atenea-files-mike";
    await s3.send(new HeadBucketCommand({ Bucket: bucketName }));
    console.log(`✅ Acceso correcto al bucket: ${bucketName}`);
  } catch (err) {
    console.error("❌ Error verificando S3:", err);
  }
}

verifyS3();
