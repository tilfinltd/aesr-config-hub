#!/usr/bin/env node
import { App, Environment } from "aws-cdk-lib";
import {
  GlobalCertificateStack,
  LocalCertificateStack,
} from "../stacks/certificate";
import { CognitoStack } from "../stacks/cognito";
import { ApiGatewayStack } from "../stacks/api-gateway";

const app = new App();

const targetEnv = app.node.tryGetContext("env");

let config: any;
try {
  config = require("../config/" + targetEnv).config;
} catch (err) {
  throw new Error("Context value [env] is not set or invalid");
}

const envGlobal: Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: "us-east-1",
};
const envLocal: Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const prefix = `aesr-${targetEnv}`;

const globalCertificateStack = new GlobalCertificateStack(
  app,
  `${prefix}-global-certificate`,
  {
    env: envGlobal,
    crossRegionReferences: true,
    subDomain: config.subDomain,
  },
);

const localCertificateStack = new LocalCertificateStack(
  app,
  `${prefix}-local-certificate`,
  {
    env: envLocal,
    subDomain: config.subDomain,
  },
);

const cognitoStack = new CognitoStack(app, `${prefix}-cognito`, {
  env: envLocal,
  prefix,
  crossRegionReferences: true,
  subDomain: config.subDomain,
  certificate: globalCertificateStack.authCertificate,
  refreshTokenValidity: config.refreshTokenValidity,
});

new ApiGatewayStack(app, `${prefix}-api-gateway`, {
  env: envLocal,
  prefix,
  subDomain: config.subDomain,
  certificate: localCertificateStack.apiCertificate,
  userPool: cognitoStack.userPool,
  configProviderLambdaName: config.configProviderLambdaName,
});
