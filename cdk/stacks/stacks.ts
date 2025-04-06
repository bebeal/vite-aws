import 'dotenv/config';
import { App } from 'aws-cdk-lib';
import { ApiStack } from './api-stack';
import { StaticStack } from './static-stack';
import { AgentsStack } from './agents-stack';

export const makeStacks = (app: App) => {
  const agentsStack = new AgentsStack(app, 'vite-aws-agents', {
    env: {
      region: process.env.AWS_REGION || 'us-west-2'
    },
  });

  const apiStack = new ApiStack(app, 'vite-aws-api', {
    env: {
      region: process.env.AWS_REGION || 'us-west-2'
    },
    fortuneAgent: agentsStack.fortuneAgent,
    fortuneAgentAlias: agentsStack.fortuneAgentAlias,
    agentRole: agentsStack.agentRole,
  });

  const staticStack = new StaticStack(app, 'vite-aws-static', {
    env: {
      region: process.env.AWS_REGION || 'us-west-2'
    },
    domain: process.env.DOMAIN,
    api: apiStack.api,
  });

  // Make static stack depend on API stack
  staticStack.addDependency(apiStack);


  return [agentsStack, apiStack, staticStack];
};
