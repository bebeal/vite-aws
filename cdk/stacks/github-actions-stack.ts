import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface GitHubActionsStackProps extends cdk.StackProps {
  githubRepo: string; // format: "owner/repo" e.g. "bebeal/vite-aws"
}

export class GitHubActionsStack extends cdk.Stack {
  public readonly role: iam.Role;

  constructor(scope: Construct, id: string, props: GitHubActionsStackProps) {
    super(scope, id, props);

    // Create OIDC Provider for GitHub Actions
    const githubProvider = new iam.OpenIdConnectProvider(this, 'GitHubActionsProvider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
    });

    // Create IAM Role for GitHub Actions
    this.role = new iam.Role(this, 'GitHubActionsDeployRole', {
      roleName: 'GitHubActionsDeployRole',
      assumedBy: new iam.WebIdentityPrincipal(
        githubProvider.openIdConnectProviderArn,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          },
          StringLike: {
            'token.actions.githubusercontent.com:sub': `repo:${props.githubRepo}:*`,
          },
        }
      ),
      description: 'Role used by GitHub Actions to deploy via CDK',
      maxSessionDuration: cdk.Duration.hours(1),
    });

    // Grant permissions needed for CDK deployments
    this.role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('PowerUserAccess')
    );

    // Additional IAM permissions (PowerUserAccess doesn't include IAM)
    this.role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'iam:CreateRole',
          'iam:DeleteRole',
          'iam:AttachRolePolicy',
          'iam:DetachRolePolicy',
          'iam:PutRolePolicy',
          'iam:DeleteRolePolicy',
          'iam:GetRole',
          'iam:GetRolePolicy',
          'iam:PassRole',
          'iam:TagRole',
          'iam:UntagRole',
        ],
        resources: ['*'],
      })
    );

    // Output the role ARN
    new cdk.CfnOutput(this, 'RoleArn', {
      value: this.role.roleArn,
      description: 'ARN of the GitHub Actions deploy role',
      exportName: 'GitHubActionsDeployRoleArn',
    });
  }
}

