import {
  APIGatewayProxyWithCognitoAuthorizerEvent,
  APIGatewayEventRequestContextV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { fetchIniFileFromS3 } from "./s3-ini-file";
// import { getUserProfileSet } from "./examples/profile-json";

const userConfigBucketName = process.env.USER_CONFIG_BUCKET!;

export const handler = async (
  event: APIGatewayProxyWithCognitoAuthorizerEvent,
  context: APIGatewayEventRequestContextV2,
): Promise<APIGatewayProxyResultV2> => {
  console.log("event: \n" + JSON.stringify(event, null, 2));

  const { authorizer } = event.requestContext;
  const { email } = authorizer.claims;
  const [user, orgDomain] = email.split("@");

  /* Check if the user is from the correct organization
  if (!["your-org.com"].includes(orgDomain)) {
    return {
      statusCode: 403,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "You are not allowed to access." }),
    };
  }
  */

  const profile = await fetchIniFileFromS3(userConfigBucketName, user, orgDomain);
  // const profile = await getUserProfileSet(user, orgDomain);
  if (!profile) {
    return {
      statusCode: 404,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Your configuration is not found." }),
    };
  }

  const userConfig = { profile };
  console.log(
    "User email: " + email,
    "User config: " + JSON.stringify(userConfig, null, 2),
  );
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userConfig),
  };
};
