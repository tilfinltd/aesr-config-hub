import { Duration, Stack, StackProps, aws_lambda_nodejs } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Effect,
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { Bucket } from "aws-cdk-lib/aws-s3";

export interface ConfigProviderStackProps extends StackProps {
  userConfigBucketName: string;
  lambdaName: string;
}

export class ConfigProviderStack extends Stack {
  constructor(scope: Construct, id: string, props: ConfigProviderStackProps) {
    super(scope, id, props);
    const { userConfigBucketName, lambdaName } = props;

    const lambdaRole = new Role(this, "ConfigProviderLambdaExecutionRole", {
      roleName: `${lambdaName}-LambdaExecutionRole`,
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole",
        ),
      ],
    });

    new aws_lambda_nodejs.NodejsFunction(this, "ConfigProviderLambda", {
      functionName: lambdaName,
      runtime: lambda.Runtime.NODEJS_20_X,
      bundling: {
        externalModules: [
          '@aws-sdk/*', // Use the AWS SDK for JS v3 available in the Lambda runtime
        ],
      },
      entry: "lambda/index.ts",
      handler: "handler",
      memorySize: 128,
      timeout: Duration.seconds(10),
      role: lambdaRole,
      environment: {
        USER_CONFIG_BUCKET: userConfigBucketName,
      },
    });

    const logGroup = new LogGroup(this, "ConfigProviderLogGroup", {
      logGroupName: `/aws/lambda/${lambdaName}`,
    });
    logGroup.grantWrite(lambdaRole);

    const userConfigBucket = new Bucket(this, "UserConfigBucket", {
      bucketName: userConfigBucketName,
    });

    userConfigBucket.addToResourcePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["s3:GetObject"],
        principals: [lambdaRole],
        resources: [userConfigBucket.bucketArn + "/*"],
      }),
    );
  }
}
