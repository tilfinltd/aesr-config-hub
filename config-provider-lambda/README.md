# Config-Provider-Lambda

This CDK stack includes a Lambda function that serves as a sample implementation of the AESR Config Hub API feature. It is designed to manage the settings of users within an organization.

## About sample implementation

it retrieves the configurations of users, such as those of a user with the email user-name@your-org.com, and saves them in an S3 bucket. These settings, particularly those for the AWS Extend Switch Roles functionality, are saved in a file named user-name.ini. The Lambda function reads this file, converts its contents into JSON format, and provides the converted data as a response.

### CDK stack and AWS Resources

- `aesr-{env}-config-provider`
    - S3 / `aesr-prd-user-config-<AWSAccountID>` bucket
    - Lambda / `aesr-prd-config-provider` function

### How to import each user configuration

Place the AWS Extend Switch Roles configuration for each user in a text file with the key `your-org.com/user-name.ini` in the bucket `aesr-prd-user-config-<AWSAccountID>` created by CDK.

## Checking authorizer.claims.email

In scenarios where your organization uses a Federation with an Identity Provider (IdP), it's possible for even non-organizational accounts to be authenticated. To address this, our Lambda function includes a verification step to ensure the user belongs to the organization. It does this by checking the domain of the user's email address.

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
npm run cdk -- deploy -c env=prd
```

This command deploys your application to the specified environment (in this case, `prd`).

## Customization After Initial Deployment

Please customize to allow members of your organization to retrieve and build data from databases and similar sources that are managed by individual AWS IAM users, regarding IAM roles that can be switched.

Structure the response following the [User Configuration API Specification](https://aesr.dev/#/api).
