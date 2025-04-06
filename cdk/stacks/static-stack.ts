import { CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import {
  AllowedMethods,
  CachePolicy,
  Distribution,
  GeoRestriction,
  OriginRequestPolicy,
  PriceClass,
  ViewerProtocolPolicy
} from 'aws-cdk-lib/aws-cloudfront';
import { RestApiOrigin, S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, CacheControl, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import path from 'path';

interface StaticStackProps extends StackProps {
  domain?: string;
  api?: RestApi;
}

export class StaticStack extends Stack {
  constructor(scope: Construct, id: string, props?: StaticStackProps) {
    super(scope, id, props);

    // Create S3 bucket for static files
    const bucket = new Bucket(this, 'vite-aws-bucket', {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: false,
    });

    // Create a single S3 origin
    const s3Origin = S3BucketOrigin.withOriginAccessControl(bucket);

    let certificate;
    let domainNames;

    if (props?.domain) {
      // Create SSL certificate for the domain if provided
      certificate = new Certificate(this, 'Certificate', {
        domainName: props.domain,
        validation: CertificateValidation.fromDns(),
      });
      domainNames = [props.domain];
    }

    if (!props?.api) {
      throw new Error('API Gateway must be provided for API requests to work');
    }

    // Create assets cache policy
    const assetsCachePolicy = new CachePolicy(this, 'vite-aws-assets-cache-policy', {
      minTtl: Duration.days(365),
      maxTtl: Duration.days(365),
      defaultTtl: Duration.days(365),
      enableAcceptEncodingGzip: true,
      enableAcceptEncodingBrotli: true,
    });

    const behaviors: Record<string, any> = {
      // Cache static assets longer
      '/assets/*': {
        origin: s3Origin,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: assetsCachePolicy
      },
      // Handle API requests
      '/api/*': {
        origin: new RestApiOrigin(props.api),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: AllowedMethods.ALLOW_ALL,
        cachePolicy: CachePolicy.CACHING_DISABLED,
        originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER
      }
    };

    // Block hackerman countries
    const restrictedCountries = [
      'RU', // Russia
      'CN', // China
      'KP', // North Korea
      'IR', // Iran
      'BY', // Belarus
    ];

    // Create CloudFront distribution with price class set to US and EU only
    // and geo-restrictions to block high-threat countries
    const distribution = new Distribution(this, 'vite-aws-distribution', {
      ...(certificate && domainNames ? { domainNames, certificate } : {}),
      defaultBehavior: {
        origin: s3Origin,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: new CachePolicy(this, 'vite-aws-cache-policy', {
          minTtl: Duration.seconds(0),
          maxTtl: Duration.days(365),
          defaultTtl: Duration.days(1),
          enableAcceptEncodingGzip: true,
          enableAcceptEncodingBrotli: true,
        }),
      },
      additionalBehaviors: behaviors,
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.minutes(0),
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.minutes(0),
        }
      ],
      // USA, Canada, Europe, & Israel
      priceClass: PriceClass.PRICE_CLASS_100,
      geoRestriction: GeoRestriction.denylist(...restrictedCountries)
    });

    // Deploy static files to S3 with proper caching
    new BucketDeployment(this, 'vite-aws-deployment', {
      sources: [Source.asset(path.resolve('dist/client'))],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
      cacheControl: [
        CacheControl.setPublic(),
        CacheControl.maxAge(Duration.days(365)),
        CacheControl.fromString('immutable'),
      ],
      prune: true,
    });

    // Output the CloudFront URL
    new CfnOutput(this, 'vite-aws-url', {
      value: distribution.distributionDomainName,
      description: 'vite-aws cloudfront distribution URL (US and EU pricing tier, restricted countries blocked)',
    });
  }
}
