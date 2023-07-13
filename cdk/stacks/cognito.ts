import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ICertificate } from "aws-cdk-lib/aws-certificatemanager";
import { IUserPool, OAuthScope, UserPool } from "aws-cdk-lib/aws-cognito";
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { UserPoolDomainTarget } from "aws-cdk-lib/aws-route53-targets";

export interface CognitoStackProps extends StackProps {
  prefix: string;
  subDomain: string;
  certificate: ICertificate;
  refreshTokenValidity: Duration;
}

export class CognitoStack extends Stack {
  public readonly userPool: IUserPool;

  constructor(scope: Construct, id: string, props: CognitoStackProps) {
    super(scope, id, props);
    const { prefix, subDomain, certificate } = props;

    const rootDomain = `${subDomain}.aesr.dev`;

    const hostedZone = HostedZone.fromLookup(this, "HostedZone", {
      domainName: rootDomain,
    });

    // For Cognito custom domain, an A record for the root domain must exist.
    new ARecord(this, "RootDomainRecord", {
      zone: hostedZone,
      recordName: rootDomain,
      target: RecordTarget.fromIpAddresses("127.0.0.1"),
    });

    const authDomain = `auth.${subDomain}.aesr.dev`;
    const callbackUrl = `https://api.${subDomain}.aesr.dev/callback`;

    const userPool = new UserPool(this, "UserPool", {
      userPoolName: `${prefix}-user-pool`,
      standardAttributes: {
        email: { required: true, mutable: true },
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const customDomain = userPool.addDomain("UserPoolDomain", {
      customDomain: {
        domainName: authDomain,
        certificate,
      },
    });

    new ARecord(this, "AuthDomainRecord", {
      zone: hostedZone,
      recordName: authDomain,
      target: RecordTarget.fromAlias(new UserPoolDomainTarget(customDomain)),
    });

    userPool.addClient("UserPoolClient", {
      userPoolClientName: `${prefix}-browser-extension`,
      generateSecret: false,
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        callbackUrls: [callbackUrl],
        scopes: [OAuthScope.OPENID, OAuthScope.EMAIL],
      },
      idTokenValidity: Duration.hours(1),
      refreshTokenValidity: props.refreshTokenValidity,
    });

    this.userPool = userPool;
  }
}
