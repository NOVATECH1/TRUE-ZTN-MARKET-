import { S3Client, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let s3: S3Client | undefined;

function getS3() {
  if (!s3) {
    const endpoint = process.env.B2_ENDPOINT!;

    s3 = new S3Client({
      endpoint,
      region: process.env.B2_REGION!,
      credentials: {
        accessKeyId: process.env.B2_KEY_ID!,
        secretAccessKey: process.env.B2_APPLICATION_KEY!,
      },
    });
  }

  return s3;
}

const bucketName = () => process.env.B2_BUCKET_NAME!;

/**
 * Creates a temporary private download URL.
 * Default: 24 hours.
 */
export async function signedDownload(
  objectKey: string,
  expiresInSeconds = 24 * 60 * 60
) {
  const command = new GetObjectCommand({
    Bucket: bucketName(),
    Key: objectKey,
  });

  return getSignedUrl(getS3(), command, {
    expiresIn: expiresInSeconds,
  });
}

/**
 * Deletes a file from Backblaze B2.
 */
export async function deleteObject(objectKey: string) {
  await getS3().send(
    new DeleteObjectCommand({
      Bucket: bucketName(),
      Key: objectKey,
    })
  );
}
