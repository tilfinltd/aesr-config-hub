import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Certificate,
  CertificateValidation,
  ICertificate,
} from "aws-cdk-lib/aws-certificatemanager";
import { HostedZone } from "aws-cdk-lib/aws-route53";

export interface CertificateStackProps extends StackProps {
  subDomain: string;
}

export class GlobalCertificateStack extends Stack {
  public readonly authCertificate: ICertificate;

  constructor(scope: Construct, id: string, props: CertificateStackProps) {
    super(scope, id, props);

    const rootDomain = `${props.subDomain}.aesr.dev`;

    const hostedZone = HostedZone.fromLookup(this, "HostedZone", {
      domainName: rootDomain,
    });

    this.authCertificate = new Certificate(this, "AuthDomainCertificate", {
      domainName: `auth.${rootDomain}`,
      validation: CertificateValidation.fromDns(hostedZone),
    });
  }
}

export class LocalCertificateStack extends Stack {
  public readonly apiCertificate: ICertificate;

  constructor(scope: Construct, id: string, props: CertificateStackProps) {
    super(scope, id, props);

    const rootDomain = `${props.subDomain}.aesr.dev`;

    const hostedZone = HostedZone.fromLookup(this, "HostedZone", {
      domainName: rootDomain,
    });

    this.apiCertificate = new Certificate(this, "ApiDomainCertificate", {
      domainName: `api.${rootDomain}`,
      validation: CertificateValidation.fromDns(hostedZone),
    });
  }
}
