import { Stack, StackProps } from "aws-cdk-lib";
import { CfnAgent, CfnAgentAlias } from "aws-cdk-lib/aws-bedrock";
import { Role, ServicePrincipal, PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class AgentsStack extends Stack {
  public readonly fortuneAgent: CfnAgent;
  public readonly fortuneAgentAlias: CfnAgentAlias;
  public readonly agentRole: Role;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create the execution role for the Bedrock Agent
    this.agentRole = new Role(this, 'FortuneCookieAgentRole', {
      assumedBy: new ServicePrincipal('bedrock.amazonaws.com'),
      description: 'Role for Fortune Cookie Bedrock Agent',
    });

    // Add necessary permissions to the agent role
    this.agentRole.addToPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        'bedrock:InvokeAgent',
        'bedrock:InvokeModel',
        'bedrock:ListFoundationModels',
        'bedrock:ListCustomModels',
        'bedrock:ListFoundationModelVersions'
      ],
      resources: ['*'],
    }));

    // Create the Bedrock Agent for fortune cookies
    const agentTemperature = 0.1;
    const agentTopK = 100;
    const agentTopP = 0.85;
    const instruction = [
      'You generate tech-themed fortune cookie messages that are dry, witty, and insightful about programming culture. COMPLY WITH ALL INSTRUCTIONS, NO EXCEPTIONS.',
      'FORMAT:',
      '- One or two sentences only',
      '- Plain text only, or ASCII art',
      'MUST INCLUDE:',
      '- Specific programming concepts, tools, practices, or tech cultural references',
      '- Dry, subtle, witty, clever humor (XKCD-style)',
      '- Ironic or existential observations about tech/programming',
      '- Funny but not overtly used programming tropes',
      'NEVER OUTPUT ANYTHING ABOUT:',
      '- 404 errors or HTTP status codes',
      '- Love, relationships, emotions, feelings',
      '- Code compilation, bugs, coffee, 404 references',
      '- Vague tech jargon without meaning',
      '- Cryptocurrency, NFTs, Web3',
      '- Emojis',
      '- ANY references to code compiling or failing to compile',
      '- NEVER OUTPUT ANYTHING ABOUT CODE COMPILING OR RUNNING ON FIRST TRY',
      'BAD FORTUNES, NEVER USE THESE:',
      '"404: Love not found - but your code will compile on the first try today"',
      '"Your heart may be broken, but your merge request won\'t be"',
      '"Your code will compile on the first try today, but don\'t let this power go to your head. With great compilation comes great responsibility."',
      '"Your coding skills will bring you happiness and fortune"',
      '"Your code will compile on the first try, but a semicolon will haunt your dreams tonight."',
      '"404: Inner peace not found - but your code compiles on the first try"',
      'GOOD FORTUNES:',
      '"That algorithm you\'re overengineering has already been implemented in a library nobody\'s maintained since 2011."',
      '"The most efficient code you\'ll write today is the code you realize you don\'t need to write at all."',
      '"There is no greater hubris than writing \'TODO: clean this up later\' in code you\'re about to push to production."',
      '"Your \'temporary workaround\' from 2019 has outlived three complete rewrites of the codebase. It will outlive us all."',
    ].join('\n');
    // jesus fucking christ you need all this just to set temperature value for an agent
    const promptOverrideConfiguration = {
      promptConfigurations: [
        {
          basePromptTemplate: JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            system: "$instruction$",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "$question$"
                  }
                ]
              },
              {
                role: "assistant",
                content: [
                  {
                    type: "text",
                    text: "$agent_scratchpad$"
                  }
                ]
              }
            ]
          }),
          inferenceConfiguration: {
            maximumLength: 512,
            stopSequences: [
                  "</invoke>",
                  "</answer>",
                  "</error>"
              ],
              temperature: agentTemperature,
              topK: agentTopK,
              topP: agentTopP
          },
          parserMode: "DEFAULT",
          promptCreationMode: "OVERRIDDEN",
          promptState: "ENABLED",
          promptType: "ORCHESTRATION"
        },
      ]
    };
    this.fortuneAgent = new CfnAgent(this, 'FortuneCookieAgent', {
      agentName: 'FortuneCookieAgent',
      description: 'A fun agent that generates fortune cookie messages',
      instruction: instruction,
      foundationModel: 'anthropic.claude-3-7-sonnet-20250219-v1:0',
      idleSessionTtlInSeconds: 1800,
      agentResourceRoleArn: this.agentRole.roleArn,
      promptOverrideConfiguration: promptOverrideConfiguration,
    });

    // Create an alias for the agent
    this.fortuneAgentAlias = new CfnAgentAlias(this, 'FortuneCookieAgentAlias', {
      agentId: this.fortuneAgent.attrAgentId,
      agentAliasName: 'FortuneCookieAlias',
    });
  }
};
