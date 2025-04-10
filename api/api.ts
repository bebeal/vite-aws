import { BedrockClient, ListFoundationModelsCommand } from "@aws-sdk/client-bedrock";
import { BedrockAgentRuntimeClient } from '@aws-sdk/client-bedrock-agent-runtime';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import express, { Request, Response, Router } from 'express';
import { getTweet } from 'react-tweet/api';

const modelsWithInferenceProfiles = [
  `arn:aws:bedrock:${process.env.AWS_REGION}:${process.env.ACCOUNT_ID}:inference-profile/us.deepseek.r1-v1:0`,
  `arn:aws:bedrock:${process.env.AWS_REGION}:${process.env.ACCOUNT_ID}:inference-profile/us.anthropic.claude-3-7-sonnet-20250219-v1:0`,
];

const hasInferenceProfile = (modelId: string): boolean => {
  return modelsWithInferenceProfiles.some(profile => profile.includes(modelId));
};

const getInferenceProfileArn = (modelId: string): string | undefined => {
  return modelsWithInferenceProfiles.find(profile => profile.includes(modelId));
};

class Api {
  public router: Router = express.Router()
  private bedrockClient: BedrockRuntimeClient;
  private bedrockAgentClient: BedrockAgentRuntimeClient;
  private bedrockModelsClient: BedrockClient;

  constructor() {
    this.setupRoutes()
    this.bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-west-2" });
    this.bedrockAgentClient = new BedrockAgentRuntimeClient({ region: process.env.AWS_REGION || "us-west-2" });
    this.bedrockModelsClient = new BedrockClient({ region: process.env.AWS_REGION || "us-west-2" });
  }

  private setupRoutes() {
    this.router.use(express.json());
    this.router.get('/tweet/:id', this.getTweet)
    this.router.post('/fortune', this.getFortune)
    this.router.get('/models', this.getModels)
    // Add more routes here as needed

    // catch all 404 for everything else
    this.router.use('*', (req, res) => {
      res.status(404).send(`${req.originalUrl || req.url} not found`)
    })
  }

  private getModels = async (req: Request, res: Response): Promise<void> => {
    try {
      const command = new ListFoundationModelsCommand({});
      const response = await this.bedrockModelsClient.send(command);

      if (!response.modelSummaries) {
        throw new Error('No models returned from Bedrock API');
      }

      res.json({
        models: {...response.modelSummaries},
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Full error object:', JSON.stringify(error, null, 2));

      res.status(500).json({
        error: 'Failed to list models',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private getFortune = async (req: Request, res: Response): Promise<void> => {
      const { modelId } = req.body;
      if (!modelId) {
        throw new Error('No modelId provided');
      }

      const systemPrompt = [
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
        '"Your YAML config will work perfectly on the third attempt, but only after you\'ve rewritten it in JSON and then converted back"',
        'GOOD FORTUNES:',
        '"That algorithm you\'re overengineering has already been implemented in a library nobody\'s maintained since 2011."',
        '"The most efficient code you\'ll write today is the code you realize you don\'t need to write at all."',
        '"There is no greater hubris than writing \'TODO: clean this up later\' in code you\'re about to push to production."',
        '"Your \'temporary workaround\' from 2019 has outlived three complete rewrites of the codebase. It will outlive us all."',
      ].join('\n');
      const temperature = 0.5;
      const topK = 100;
      const topP = 0.85;
      const maxTokens = 256;
      // Use the new function to get the inference profile ARN
      const modelIdToUse = hasInferenceProfile(modelId) ? getInferenceProfileArn(modelId) : modelId;
      // Check if this is a DeepSeek model
      const isDeepSeekModel = modelIdToUse?.toLowerCase().includes('deepseek');

      let command;
      if (isDeepSeekModel) {
        const formattedPrompt = `
        ${systemPrompt}
        <think>
        I'm not gonna waste time with steps or explanations. The instructions are clear - just create ONE SINGLE witty tech fortune cookie.
        </think>
        "`;
        // Use the correct format for DeepSeek models
        command = new InvokeModelCommand({
          modelId: modelIdToUse,
          contentType: "application/json",
          accept: "application/json",
          body: JSON.stringify({
            prompt: formattedPrompt,
            max_tokens: maxTokens,
            temperature: temperature,
            top_p: topP,
          })
        });
      } else {
        // Use the existing format for other models (like Claude)
        command = new InvokeModelCommand({
          modelId: modelIdToUse,
          body: JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            system: systemPrompt,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Generate a tech fortune cookie that is not cringe or lame. It should be a short, witty, and insightful message about programming culture."
                  }
                ]
              }
            ],
            max_tokens: maxTokens,
            temperature: temperature,
            top_k: topK,
            top_p: topP,
          }),
          contentType: "application/json",
          accept: "application/json",
        });
      }

      try {
        const response = await this.bedrockClient.send(command);

        if (!response.body) {
          throw new Error("Response body is undefined");
        }
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));

        const fortune = isDeepSeekModel
          ? responseBody.choices?.[0]?.text?.trim()
          : responseBody.content?.[0]?.text;
        const result = {
          fortune: fortune,
          timestamp: new Date().toISOString(),
          modelId: modelIdToUse
        };
        res.json(result);
    } catch (error) {
      console.error('Bedrock Model error:', JSON.stringify(error, null, 2));

      res.status(500).json({
        error: error,
        modelId: modelIdToUse
      });
    }
  }

  private getTweet = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const tweet = await getTweet(id)
      res.json({ data: tweet })
    } catch (error) {
      console.error('Tweet error:', JSON.stringify(error, null, 2));
      res.status(500).json({ error: 'An error occurred while fetching the tweet' })
    }
  }

  // returns a list of all the routes defined in the router
  public listRoutes(): string[] {
    return this.router.stack
      .filter(r => r.route)
      .map(r => r.route!.path);
  }
}

export default new Api();
