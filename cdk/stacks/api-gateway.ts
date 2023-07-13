import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  DomainName,
  RestApi,
  CognitoUserPoolsAuthorizer,
  MockIntegration,
  PassthroughBehavior,
  Model,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { ICertificate } from "aws-cdk-lib/aws-certificatemanager";
import { IUserPool } from "aws-cdk-lib/aws-cognito";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { ApiGatewayDomain } from "aws-cdk-lib/aws-route53-targets";

export interface ApiGatewayStackProps extends StackProps {
  prefix: string;
  subDomain: string;
  certificate: ICertificate;
  userPool: IUserPool;
  configProviderLambdaName: string;
}

export class ApiGatewayStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);
    const { prefix, subDomain, certificate } = props;

    const rootDomain = `${subDomain}.aesr.dev`;

    const hostedZone = HostedZone.fromLookup(this, "HostedZone", {
      domainName: rootDomain,
    });

    const apiDomain = `api.${subDomain}.aesr.dev`;
    const restApi = new RestApi(this, `${prefix}-api`);

    const domainName = new DomainName(this, "ApiDomain", {
      domainName: apiDomain,
      certificate,
    });

    domainName.addBasePathMapping(restApi);

    new ARecord(this, "ApiDomainRecord", {
      zone: hostedZone,
      recordName: apiDomain,
      target: RecordTarget.fromAlias(new ApiGatewayDomain(domainName)),
    });

    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      "CognitoAuthorizer",
      {
        authorizerName: "CognitoAuthorizer",
        cognitoUserPools: [props.userPool],
      },
    );

    const callbackRes = restApi.root.addResource("callback");
    callbackRes.addMethod(
      "GET",
      new MockIntegration({
        passthroughBehavior: PassthroughBehavior.WHEN_NO_MATCH,
        requestTemplates: {
          "application/json": '{"statusCode":200}',
        },
        integrationResponses: [
          {
            statusCode: "200",
            responseTemplates: {
              "text/html": `<html>
            <body style="font-family:sans-serif;padding:36px">
             <p style="font-size:18px;line-height:2">
               Please keep this tab open and<br>
               <u>click on the <strong>AWS Extend Switch Roles</strong> icon</u>
               in your browser toolbar<br>
               to complete the connection to <strong>AESR Config Hub</strong>.
             </p>
            </body>
           </html>`,
            },
          },
        ],
      }),
      {
        methodResponses: [
          {
            statusCode: "200",
            responseModels: { "text/html": Model.EMPTY_MODEL },
          },
        ],
      },
    );

    const configProviderLambda = lambda.Function.fromFunctionName(
      this,
      "ConfigProviderLambda",
      props.configProviderLambdaName,
    );
    const userRes = restApi.root.addResource("user");
    const configRes = userRes.addResource("config");
    configRes.addMethod("GET", new LambdaIntegration(configProviderLambda), {
      authorizer,
    });
  }
}
