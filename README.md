<div align="center">

# <img src="https://raw.githubusercontent.com/bebeal/vite-aws/main/public/favicon.ico" width="32" style="vertical-align: middle;"> vite-aws

</div>

Template for a web server application deployed with a cost-effective scalable AWS architecture:

- Static content served via CloudFront distribution from S3
- Serverless API endpoints using Lambda functions with Express routes for on-demand compute
- Infrastructure as Code using AWS CDK for manageable deployments
- Near-zero cost when idle, with pay-per-use pricing for both static hosting and API compute

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

## Build

The build outputs to `dist` folder. The build is split into two parts, the client side and the server side.
- Note: you can turn off sourcemaps in the vite config and get rid of all the .map files to save space

```console
dist
├── client
│   ├── assets
│   │   ├── BerkeleyMonoVariable-DfD1MzWf.woff2                 162.33 kB │ gzip:   162.43 kB
│   │   ├── BerkeleyMonoVariable-IbYT6BjK.ttf                   507.43 kB │ gzip:   208.20 kB
│   │   ├── FloatingTanStackRouterDevtools-BrvLUCF_.js           52.55 kB │ gzip:    15.34 kB
│   │   ├── FloatingTanStackRouterDevtools-BrvLUCF_.js.map      137.62 kB │ gzip:    33.05 kB
│   │   ├── SUXNJKMM-BR_7YIqf.js                                219.53 kB │ gzip:    62.32 kB
│   │   ├── SUXNJKMM-BR_7YIqf.js.map                            729.00 kB │ gzip:   164.27 kB
│   │   ├── ai21labs-Dm-89zQZ.jpeg                                4.83 kB │ gzip:     4.31 kB
│   │   ├── claude3_7-CPbaIE2D.png                                5.98 kB │ gzip:     6.01 kB
│   │   ├── index-Ba_qlnl_.css                                   18.80 kB │ gzip:     4.72 kB
│   │   ├── index-D5xHVAf7.js                                   208.24 kB │ gzip:    74.78 kB
│   │   ├── index-D5xHVAf7.js.map                               565.03 kB │ gzip:   159.59 kB
│   │   ├── index-f49Dk-TT.js                                   330.24 kB │ gzip:    99.33 kB
│   │   ├── index-f49Dk-TT.js.map                              1401.68 kB │ gzip:   297.34 kB
│   │   ├── luma-DfNJhya8.png                                   169.92 kB │ gzip:   154.67 kB
│   │   ├── react-BRTw4jLb.js                                    32.78 kB │ gzip:    10.54 kB
│   │   ├── react-BRTw4jLb.js.map                               112.04 kB │ gzip:    28.12 kB
│   │   ├── tanstack-B00gFvJH.js                                172.93 kB │ gzip:    53.27 kB
│   │   ├── tanstack-B00gFvJH.js.map                            733.60 kB │ gzip:   186.07 kB
│   │   └── tanstack-router-Q5CIJCHp.png                         10.38 kB │ gzip:    10.43 kB
│   ├── favicon.ico                                             252.71 kB │ gzip:    18.97 kB
│   ├── index.html                                                 .83 kB │ gzip:      .43 kB
│   └── robots.txt                                                 .06 kB │ gzip:      .08 kB
├── server
│   ├── api
│   │   ├── api.d.ts                                               .35 kB │ gzip:      .20 kB
│   │   ├── api.js                                                8.85 kB │ gzip:     2.87 kB
│   │   └── utils
│   │       ├── parsing.d.ts                                       .23 kB │ gzip:      .17 kB
│   │       └── parsing.js                                        2.03 kB │ gzip:      .82 kB
│   ├── assets
│   │   └── index-DbHRN-SX.js                                   133.88 kB │ gzip:    49.45 kB
│   ├── entry-server.js                                           7.10 kB │ gzip:     2.35 kB
│   ├── favicon.ico                                             252.71 kB │ gzip:    18.97 kB
│   ├── package.json                                              3.08 kB │ gzip:     1.13 kB
│   ├── robots.txt                                                 .06 kB │ gzip:      .08 kB
│   ├── server.d.ts                                                .34 kB │ gzip:      .21 kB
│   ├── server.js                                                 5.15 kB │ gzip:     2.03 kB
│   ├── tsconfig.node.tsbuildinfo                               139.27 kB │ gzip:    40.23 kB
│   ├── vite.config.d.ts                                           .08 kB │ gzip:      .10 kB
│   ├── vite.config.js                                            2.58 kB │ gzip:      .83 kB
│   └── yarn.lock                                                    0 kB │ gzip:      .02 kB
└── server-deps
    └── nodejs
        ├── package.json                                          3.08 kB │ gzip:     1.13 kB
        └── yarn.lock                                                0 kB │ gzip:      .02 kB

9 directories, 39 files
```

- `client/` is directly served as shown from s3 through cloudfront
- `server/` becomes the lambda function code
- `server-deps/` is the lambda servers dependencies
