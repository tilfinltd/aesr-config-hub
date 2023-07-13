import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { ConfigProviderStack } from "../stacks/config-provider";

const cdkJson = require("../cdk.json");

describe("All stacks", () => {
  test("default", () => {
    const app = new App(cdkJson);
    const env = {
      region: "ap-northeast-1",
      account: "000011112222",
    };
    const prefix = "aesr-test";

    const configProviderLambdaStack = new ConfigProviderStack(
      app,
      `${prefix}-config-provider`,
      {
        bucketName: `${prefix}-config-provider-${env.account}`,
        lambdaName: `${prefix}-config-proivder`,
      },
    );
    const configProviderTemplate = Template.fromStack(
      configProviderLambdaStack,
    ).toJSON();
    expect(configProviderTemplate).toMatchSnapshot();
  });
});
