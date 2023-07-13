import { Duration } from "aws-cdk-lib";

interface IConfig {
  configProviderLambdaName: string;
  subDomain: string;
  refreshTokenValidity: Duration;
}

export const config: IConfig = {
  configProviderLambdaName: "aesr-prd-config-provider",
  subDomain: "<your-orgname>",
  refreshTokenValidity: Duration.days(30),
};
