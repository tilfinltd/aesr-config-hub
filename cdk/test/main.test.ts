import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import {
  GlobalCertificateStack,
  LocalCertificateStack,
} from "../stacks/certificate";
import { CognitoStack } from "../stacks/cognito";
import { ApiGatewayStack } from "../stacks/api-gateway";

const cdkJson = require("../cdk.json");

describe("All stacks", () => {
  test("default", () => {
    const app = new App(cdkJson);
    const env = {
      region: "ap-northeast-1",
      account: "000011112222",
    };
    const subDomain = "subdomain";
    const prefix = "aesr-test";

    const globalCertificateStack = new GlobalCertificateStack(
      app,
      `${prefix}-global-certificate`,
      {
        env,
        crossRegionReferences: true,
        subDomain,
      },
    );

    const localCertificateStack = new LocalCertificateStack(
      app,
      `${prefix}-local-certificate`,
      {
        env,
        subDomain,
      },
    );

    const cognitoStack = new CognitoStack(app, `${prefix}-cognito`, {
      env,
      prefix,
      subDomain,
      certificate: globalCertificateStack.authCertificate,
      refreshTokenValidityDays: 30,
    });

    const apiGatewayStack = new ApiGatewayStack(app, `${prefix}-api-gateway`, {
      env,
      prefix,
      subDomain,
      certificate: localCertificateStack.apiCertificate,
      userPool: cognitoStack.userPool,
      configProviderLambdaName: "aesr-test-config-proivder",
    });

    const globalCertificateTemplate = Template.fromStack(
      globalCertificateStack,
    ).toJSON();
    expect(globalCertificateTemplate).toMatchSnapshot();

    const LocalCertificateTemplate = Template.fromStack(
      localCertificateStack,
    ).toJSON();
    expect(LocalCertificateTemplate).toMatchSnapshot();

    const cognitoTemplate = Template.fromStack(cognitoStack).toJSON();
    expect(cognitoTemplate).toMatchSnapshot();

    const apiGatewayTemplate = Template.fromStack(apiGatewayStack).toJSON();
    expect(apiGatewayTemplate).toMatchSnapshot();
  });
});
