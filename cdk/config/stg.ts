import { Duration } from "aws-cdk-lib";

interface IConfig {
  configProviderLambdaName: string;
  subDomain: string;
  refreshTokenValidity: Duration;
}

export const config: IConfig = {
  configProviderLambdaName: "aesr-stg-config-provider",
  subDomain: "stg.<your-orgname>",
  refreshTokenValidity: Duration.hours(1),
};
