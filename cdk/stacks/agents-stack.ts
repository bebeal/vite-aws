import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

export class AgentsStack extends Stack {

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    // Well I used to have an agent defined here but then I switched the code to rely on InvokeModel instead so now this is just an empty stack
  }
};
