import { BedrockAgentRuntimeClient, InvokeAgentCommand } from '@aws-sdk/client-bedrock-agent-runtime';
import express, { Request, Response, Router } from 'express';
import { getTweet } from 'react-tweet/api';
import { v4 as uuidv4 } from 'uuid';

class Api {
  public router: Router = express.Router()
  private bedrockClient: BedrockAgentRuntimeClient;

  constructor() {
    this.setupRoutes()
    this.bedrockClient = new BedrockAgentRuntimeClient({ region: process.env.AWS_REGION || "us-west-2" });
  }

  private setupRoutes() {
    this.router.get('/tweet/:id', this.getTweet)
    this.router.get('/fortune', this.getFortune)
    // Add more routes here as needed

    // catch all 404 for everything else
    this.router.use('*', (req, res) => {
      res.status(404).send(`${req.originalUrl || req.url} not found`)
    })
  }

  private getFortune = async (req: Request, res: Response) => {
    try {
      const sessionId = "fortune-session-" + Date.now() + "-" + uuidv4();
      const command = new InvokeAgentCommand({
        agentId: process.env.FORTUNE_AGENT_ID,
        agentAliasId: process.env.FORTUNE_AGENT_ALIAS_ID,
        sessionId: sessionId,
        inputText: "Give me a fortune. FOLLOW ALL INSTRUCTIONS.",
      });

      const response = await this.bedrockClient.send(command);

      let fortune = "";
      if (response.completion === undefined) {
        throw new Error("Completion is undefined");
      }

      for await (const chunkEvent of response.completion) {
        const chunk = chunkEvent.chunk;
        const decodedResponse = new TextDecoder("utf-8").decode(chunk?.bytes);
        fortune += decodedResponse;
      }

      res.json({
        fortune: fortune,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Bedrock Agent error:', error);
      res.status(500).json({
        error: 'Failed to generate fortune',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private getTweet = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const tweet = await getTweet(id)
      res.json({ data: tweet })
    } catch (error) {
      console.error(error)
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
