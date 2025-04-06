import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { CfnAgent, CfnAgentAlias,  } from 'aws-cdk-lib/aws-bedrock';
import { AnyPrincipal, Effect, PolicyDocument, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Architecture, Code, Function, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import path from 'path';

interface ApiStackProps extends StackProps {
  fortuneAgent: CfnAgent;
  fortuneAgentAlias: CfnAgentAlias;
  agentRole: Role;
}

export class ApiStack extends Stack {
  public readonly api: RestApi;

  constructor(scope: Construct, id: string, props?: ApiStackProps) {
    super(scope, id, props);

    // Create lambda layer with server dependencies (postbuild.sh packages these into the output dist directory)
    const serverDepsLayer = new LayerVersion(this, 'ServerDepsLayer', {
      code: Code.fromAsset('dist/server-deps'),
      compatibleRuntimes: [Runtime.NODEJS_20_X],
    });

    // Create Lambda function
    const handler = new Function(this, 'ExpressHandler', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'server.handler',
      code: Code.fromAsset(path.resolve('dist/server')),
      layers: [serverDepsLayer],
      environment: {
        NODE_ENV: 'production',
        FORTUNE_AGENT_ID: props?.fortuneAgent.attrAgentId || '',
        FORTUNE_AGENT_ALIAS_ID: props?.fortuneAgentAlias.attrAgentAliasId || '',
      },
      timeout: Duration.seconds(30),
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
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            'iam:PassRole'
          ],
          resources: [props?.agentRole.roleArn || ''],
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
