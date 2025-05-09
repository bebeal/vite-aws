<div align="center">

# <img src="https://raw.githubusercontent.com/bebeal/vite-aws/main/public/favicon.ico" width="32" style="vertical-align: middle;"> vite-aws

</div>

Template for a web server application deployed with a cost-effective scalable AWS architecture:

- Static content served via CloudFront distribution from S3
- Serverless API endpoints using Lambda functions with Express routes for on-demand compute
- Infrastructure as Code using AWS CDK for manageable deployments
- Near-zero cost when idle, with pay-per-use pricing for both static hosting and API compute
- (<small style="font-size:0.9em">Branch available with built in MDX rendering:
<a href="https://github.com/bebeal/vite-aws/tree/with-mdx"><img src="https://img.shields.io/badge/-with--mdx%20branch-ffffff?logo=github&style=flat&logoColor=000000" style="height:14px; vertical-align:middle"></a></small> - <a href="https://vite-aws.com/posts">https://vite-aws.com/posts</a>)

<div align="center">
  <a href="https://vite-aws.com" rel="noopener noreferrer" target="_blank">vite-aws.com</a>
<kbd>
  <img src="https://github.com/user-attachments/assets/82ff8f5d-60fa-48b7-98d8-eb10c7a9b7f8" alt="Image of landing page" />
</kbd></div>

## Features

* [Node](https://nodejs.org/docs)
* [Yarn](https://classic.yarnpkg.com/en/docs)
* [Vite](https://vitejs.dev/guide/)
* [React](https://react.dev/reference/react)
* [TypeScript](https://www.typescriptlang.org/docs/)
* [Express](https://expressjs.com/en/4x/api.html)
* [TanStack Router](https://tanstack.com/router/latest/docs/framework/react/overview)
* [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview)
* [Tailwind](https://tailwindcss.com/docs)
* [Eslint](https://eslint.org/docs/latest/)
* [Prettier](https://prettier.io/docs/en/)
* [AWS S3](https://docs.aws.amazon.com/s3/)
* [AWS CloudFront](https://docs.aws.amazon.com/cloudfront/)
* [AWS Lambda](https://docs.aws.amazon.com/lambda/)
* [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/home.html)
* [AWS Bedrock](https://docs.aws.amazon.com/bedrock/)

## Other Libraries

* [vitest](https://vitest.dev/guide/)
* [nodemon](https://github.com/remy/nodemon)
* [tsx](https://github.com/privatenumber/tsx)
* [dotenv](https://github.com/motdotla/dotenv?tab=readme-ov-file)
* [svgr](https://github.com/gregberge/svgr)
* [react-tweet](https://github.com/vercel/react-tweet)
* [next-themes](https://github.com/pacocoursey/next-themes)

## Environment Setup

After cloning, copy `.env.example` to `.env` and add your AWS credentials.

<small>
Note: Env variables are injected into the lambda function as environment variables. (except for reserved AWS variables)
</small>

## Development

Using yarn
```bash
corepack enable         // enable corepack
yarn set version berry  // set yarn to latest version
yarn                    // install dependencies
```

<div align="center">
    <img width="894" alt="Screenshot 2025-04-05 at 6 10 03 PM" src="https://github.com/user-attachments/assets/4432b4ee-d2a6-40ca-ba24-60c88b9e7723" />
</div>

```bash
yarn dev          // run the development server
```

<div align="center">
    <img width="894" alt="Screenshot 2025-04-05 at 6 18 51 PM" src="https://github.com/user-attachments/assets/b4e63ddf-13ca-40b2-b876-4d96c1211885" />
</div>


```bash
yarn build        // build both client side and server side build
```

<div align="center">
  <img width="894" alt="Screenshot 2025-04-05 at 6 17 23 PM" src="https://github.com/user-attachments/assets/83015c72-50df-4221-b792-53a878bea486" />
</div>

**Additional Commands**

```bash
yarn clean        // clean everything thats generated in the build/dev process
yarn build:client // build the client side to dist/client
yarn build:server // build the server side to dist/server
yarn lint         // run eslint
yarn format       // run prettier
yarn test         // run tests
```

## CDK

```bash
yarn build:cdk    // build the cdk
yarn deploy       // deploy the cdk
```

<div align="center">
    <img width="894" alt="Screenshot 2025-04-05 at 6 27 30 PM" src="https://github.com/user-attachments/assets/94780d61-498c-4153-8452-bd9c05dac17d" />
</div>
