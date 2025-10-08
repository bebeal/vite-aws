import { App } from 'aws-cdk-lib';
import 'dotenv/config';
import { ApiStack } from './api-stack';
import { GitHubActionsStack } from './github-actions-stack';
import { StaticStack } from './static-stack';

export const makeStacks = (app: App) => {
  const githubRepo = process.env.GITHUB_REPO || 'bebeal/vite-aws';

  const githubActionsStack = new GitHubActionsStack(app, 'vite-aws-github', {
    env: {
      region: process.env.AWS_REGION || 'us-west-2'
    },
    githubRepo,
  });

  const apiStack = new ApiStack(app, 'vite-aws-api', {
    env: {
      region: process.env.AWS_REGION || 'us-west-2'
    },
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


  return [githubActionsStack, apiStack, staticStack];
};
