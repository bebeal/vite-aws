<div align="center">

# vite-aws

</div>

A web application template with a cost-effective, scalable AWS architecture:

- Static content served via CloudFront distribution from S3
- Serverless API endpoints using Lambda functions with Express routes for on-demand compute
- Infrastructure as Code using AWS CDK for manageable deployments
- Near-zero cost when idle, with pay-per-use pricing for both static hosting and API compute

<div align="center">
  <a href="https://vite-aws.com" rel="noopener noreferrer" target="_blank">vite-aws.com</a>
<kbd>
  <img width="1512" alt="Screenshot 2025-04-04 at 10 00 06 AM" src="https://github.com/user-attachments/assets/0f326253-8fcb-46d1-8e6e-b26887baba97" />
</kbd></div>

## Features

* [Node](https://nodejs.org/docs)
* [Yarn](https://classic.yarnpkg.com/en/docs)
* [Vite](https://vitejs.dev/guide/)
* [React](https://react.dev/reference/react)
* [TypeScript](https://www.typescriptlang.org/docs/)
* [Express](https://expressjs.com/en/4x/api.html)
* [TanStack Router](https://tanstack.com/router/latest/docs/framework/react/overview)
* [Tailwind](https://tailwindcss.com/docs)
* [Eslint](https://eslint.org/docs/latest/)
* [Prettier](https://prettier.io/docs/en/)
* [AWS S3](https://docs.aws.amazon.com/s3/)
* [AWS CloudFront](https://docs.aws.amazon.com/cloudfront/)
* [AWS Lambda](https://docs.aws.amazon.com/lambda/)
* [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/home.html)

## Other Libraries

* [nodemon](https://github.com/remy/nodemon)
* [tsx](https://github.com/privatenumber/tsx)
* [dotenv](https://github.com/motdotla/dotenv?tab=readme-ov-file)
* [svgr](https://github.com/gregberge/svgr)
* [react-tweet](https://github.com/vercel/react-tweet)
* [next-themes](https://github.com/pacocoursey/next-themes)

## Development

Using yarn
```bash
corepack enable         // enable corepack
yarn set version berry  // set yarn to latest version
yarn                    // install dependencies
```

<div align="center">
    <img width="890" alt="425781036-dacb70a0-1228-4cb1-b4a6-8ee62b64aa52" src="https://github.com/user-attachments/assets/e36ed390-d7dd-428a-8938-628da134e88a" />
</div>

```bash
yarn dev          // run the development server
```

<div align="center">
    <img width="894" alt="425781309-25c7c40e-b8e0-4d4c-9fd7-f565d9bc9eb8" src="https://github.com/user-attachments/assets/b88065b8-a66f-4e9e-b9fc-9b5d823a4120" />
</div>

```bash
yarn build        // build both client side and server side build
```

<div align="center">
    <img width="894" alt="425345804-2eb9c561-bd5a-411c-9acf-d31074abb794 (1)" src="https://github.com/user-attachments/assets/3f994f23-476b-4ed7-9109-50d40c0495f2" />
</div>

**Additional Commands**

```bash
yarn clean        // clean everything thats generated in the build/dev process
yarn build:client // build the client side to dist/client
yarn build:server // build the server side to dist/server
yarn lint         // run eslint
yarn format       // run prettier
```

## CDK

```bash
yarn build:cdk    // build the cdk
yarn deploy:cdk   // deploy the cdk
```

<div align="center">
    <img width="787" alt="425349353-ad9d52cc-9046-4cd2-b072-1b47083eb48d" src="https://github.com/user-attachments/assets/0ea6d023-35dc-41c6-86c5-84adc5bb19c6" />
</div>

## Build

The build outputs to `dist` folder. The build is split into two parts, the client side and the server side.
- Note: you can turn off sourcemaps in the vite config and get rid of all the .map files to save space

```console
dist
├── client
│   ├── assets
│   │   ├── BerkeleyMonoVariable-DfD1MzWf.woff2      162.33 kB │ gzip:   162.43 kB
│   │   ├── BerkeleyMonoVariable-IbYT6BjK.ttf        507.43 kB │ gzip:   208.20 kB
│   │   ├── index-0WbFXP-I.js                         53.00 kB │ gzip:    18.30 kB
│   │   ├── index-0WbFXP-I.js.map                     96.72 kB │ gzip:    26.66 kB
│   │   ├── index-CuTdIqv9.css                        12.70 kB │ gzip:     3.53 kB
│   │   ├── index-DAIUZZYd.js                        246.00 kB │ gzip:    78.72 kB
│   │   └── index-DAIUZZYd.js.map                   1122.59 kB │ gzip:   260.18 kB
│   ├── favicon.ico                                   14.73 kB │ gzip:     4.46 kB
│   ├── index.html                                      .65 kB │ gzip:      .38 kB
│   └── robots.txt                                      .06 kB │ gzip:      .08 kB
├── server
│   ├── api
│   │   ├── api.d.ts                                    .21 kB │ gzip:      .16 kB
│   │   └── api.js                                     1.01 kB │ gzip:      .47 kB
│   ├── assets
│   │   └── index-B9F-Uz_l.js                         49.43 kB │ gzip:    16.79 kB
│   ├── entry-server.js                                1.25 kB │ gzip:      .75 kB
│   ├── favicon.ico                                   14.73 kB │ gzip:     4.46 kB
│   ├── package.json                                   2.58 kB │ gzip:     1.00 kB
│   ├── robots.txt                                      .06 kB │ gzip:      .08 kB
│   ├── server.d.ts                                     .34 kB │ gzip:      .21 kB
│   ├── server.js                                      4.89 kB │ gzip:     1.94 kB
│   ├── tsconfig.node.tsbuildinfo                     57.87 kB │ gzip:    18.30 kB
│   ├── vite.config.d.ts                                .08 kB │ gzip:      .10 kB
│   ├── vite.config.js                                 1.95 kB │ gzip:      .72 kB
│   └── yarn.lock                                         0 kB │ gzip:      .02 kB
└── server-deps
    └── nodejs
        ├── package.json                               2.58 kB │ gzip:     1.00 kB
        └── yarn.lock                                     0 kB │ gzip:      .02 kB

8 directories, 25 files
```

- `serveer/` becomes the lambda function code
- `client/` is directly served as shown from s3 through cloudfront
- `server-deps/` is the lambda servers dependencies

## TODO

- [ ] Easy throttle/permission control for API endpoints
- [ ] Add api that calls llm in bedrock
- [ ] Update readme images
