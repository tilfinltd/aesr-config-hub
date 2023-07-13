import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ComplexProfile, ConfigParser, SingleProfile } from "aesr-config";

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export async function fetchIniFileFromS3(
  bucketName: string,
  user: string,
  orgDomain: string,
): Promise<{ singles: SingleProfile[]; complexes: ComplexProfile[] } | null> {
  const iniFileKey = `${orgDomain}/${user}.ini`;

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: iniFileKey,
  });

  const s3obj = await s3Client.send(command);
  const cfgIniText = await s3obj.Body?.transformToString();
  if (!cfgIniText) {
    return null;
  }

  // Parsing the configuration text
  const profileSet = ConfigParser.parseIni(cfgIniText);
  return profileSet;
}
