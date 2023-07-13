#!/usr/bin/env node
import { App, Environment } from "aws-cdk-lib";
import { ConfigProviderStack } from "../stacks/config-provider";

const app = new App();

const targetEnv = app.node.tryGetContext("env");

if (!targetEnv) throw new Error("Context value [env] is not set or invalid");

const env: Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const prefix = `aesr-${targetEnv}`;

new ConfigProviderStack(app, `${prefix}-config-provider`, {
  env,
  userConfigBucketName: `${prefix}-user-config-${env.account}`,
  lambdaName: `${prefix}-config-provider`,
});
