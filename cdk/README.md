# Setting Up Common Resources for AESR Config Hub with CDK

This CDK (Cloud Development Kit) setup helps in configuring the essential components for the AESR Config Hub. It includes setting up a Cognito User Pool for user authentication, an API Gateway as the entry point for APIs, and SSL/TLS certificates through the Certificate Manager. Additionally, it also creates the necessary **api.<org>.aesr.dev** and **auth.<org>.aesr.dev** domains in AWS Route 53.

## Configuring Deployment Parameters

To customize the setup for your specific deployment environment, you'll need to adjust the settings in the `cdk/config/{env}.ts` file. Follow these steps to edit your configuration:

1. Locate the configuration file for your environment. The path follows the pattern `cdk/config/{env}.ts`, where `{env}` should be replaced with your environment's name (e.g., `prd` for production).

2. Within this file, you'll find an object definition in the `config` section. You need to edit this object to match your deployment specifications.
    - **subDomain** - Specify the subdomain that represents your organization, as registered in Amazon Route 53. For environments designated for staging (labelled `stg`), you must set up a corresponding `stg` subdomain beforehand. Use the format `stg.<org>`, replacing `<org>` with your organization's name. This setup is crucial for proper domain routing and access.
    - **refreshTokenValidity** - https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html#cfn-cognito-userpoolclient-refreshtokenvalidity

By carefully adjusting these parameters, you can ensure that your deployment environment is correctly configured to reflect your organization's infrastructure and naming conventions.

## CDK stacks and AWS Resources

- `aesr-{env}-global-certificate`
    - CertificateManager / certificate for `auth` domain
- `aesr-{env}-local-certificate`
    - CertificateManager / certificate for `api` domain
- `aesr-{env}-cognito`
    - Cognito / User pool `aesr-{env}-user-pool`
        - A domain for your Hosted UI and OAuth 2.0 endpoints `https://auth.{org}.aesr.dev`
        - App client `aesr-{env}-browser-extension`
    - Route 53 / root domain record
    - Route 53 / `auth` domain record
- `aesr-{env}-api-gateway`
    - API Gateway / REST API `aesr-{env}-api` `https://api.{org}.aesr.dev`
    - Route 53 / `api` domain record

## Deployment Instructions

Use the following commands for deployment. Add the `--profile` option as needed, similar to how you would use it with **awscli**, to access your target AWS account.

### Initial Setup

1. First, bootstrap your environment. Open your terminal and run the following command:

```bash
npm run cdk -- bootstrap -c env=prd
```

This step prepares your AWS environment for deployment.

### Deploy Your Application

2. Once the setup is complete, you can deploy your application by executing:

```bash
npm run cdk -- deploy --all -c env=prd
```

This command deploys your application to the specified environment (in this case, `prd`).
