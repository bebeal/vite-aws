import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { AnyPrincipal, Effect, PolicyDocument, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Architecture, Code, DockerImageCode, DockerImageFunction, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import * as dotenv from 'dotenv';
import path from 'path';

interface ApiStackProps extends StackProps {

}

export class ApiStack extends Stack {
  public readonly api: RestApi;

  constructor(scope: Construct, id: string, props?: ApiStackProps) {
    super(scope, id, props);

    const logGroup = new LogGroup(this, 'ExpressHandlerLogs', {
      logGroupName: `/aws/lambda/${this.stackName}-ExpressHandler-logs`
    });

    // Create Lambda function
    const handler = new DockerImageFunction(this, 'ExpressHandler', {
      code: DockerImageCode.fromImageAsset(path.resolve('.')),
      environment: {
        // ignore AWS_ variables as they are reserved for AWS
        ...Object.fromEntries(
          Object.entries(dotenv.config().parsed || {})
            .filter(([key]) => !key.startsWith('AWS_'))
        ),
        NODE_ENV: 'production',
      },
      functionName: `${this.stackName}-ExpressHandler`,
      logGroup: logGroup,
      timeout: Duration.seconds(60),
      memorySize: 1024,
      architecture: Architecture.ARM_64,
      initialPolicy: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            'bedrock:InvokeAgent',
            'bedrock:InvokeModel',
            'bedrock:ListFoundationModels',
            'bedrock:ListCustomModels',
            'bedrock:ListFoundationModelVersions',
            'bedrock:InvokeAgentWithResponseStream'
          ],
          resources: ['*'],
        }),
      ],
    });

    // Create API Gateway
    this.api = new RestApi(this, 'ExpressApi', {
      restApiName: 'Vite Express API',
      description: 'API Gateway for Vite Express application',
      binaryMediaTypes: ['*/*'],
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token'],
        allowCredentials: true,
        maxAge: Duration.days(1),
      },
      deployOptions: {
        tracingEnabled: true,
        dataTraceEnabled: true,
        metricsEnabled: true,
      },
      policy: new PolicyDocument({
        statements: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['execute-api:Invoke'],
            resources: ['*'],
            principals: [new AnyPrincipal()]
          })
        ]
      })
    });

    // Integrate Lambda with API Gateway
    const integration = new LambdaIntegration(handler, {
      proxy: true,
      allowTestInvoke: false,
    });

    // Add catch-all proxy resource
    this.api.root.addProxy({
      defaultIntegration: integration,
      anyMethod: true,
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token'],
        allowCredentials: true,
        maxAge: Duration.days(1),
      },
    });
  }
}
