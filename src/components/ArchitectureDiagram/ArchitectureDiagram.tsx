import React, { HTMLProps, JSX, memo, ReactNode } from 'react';
import APIGatewayIcon from '../../assets/icons/apigateway.svg';
import BedrockIcon from '../../assets/icons/bedrock.svg';
import CDKIcon from '../../assets/icons/cdk.svg';
import CloudFrontIcon from '../../assets/icons/cloudfront.svg';
import ESLintIcon from '../../assets/icons/eslint.svg';
import ExpressIcon from '../../assets/icons/express.svg';
import GithubIcon from '../../assets/icons/github.svg';
import GithubActionsIcon from '../../assets/icons/githubactions.svg';
import LambdaIcon from '../../assets/icons/lambda.svg';
import NodeIcon from '../../assets/icons/node.svg';
import PrettierIcon from '../../assets/icons/prettier.svg';
import ReactIcon from '../../assets/icons/react.svg';
import S3Icon from '../../assets/icons/S3.svg';
import TailwindIcon from '../../assets/icons/tailwind.svg';
import TypeScriptIcon from '../../assets/icons/typescript.svg';
import ViteIcon from '../../assets/icons/vite.svg';
import VitestIcon from '../../assets/icons/vitest.svg';
import WebIcon from '../../assets/icons/web.svg';
import YarnIcon from '../../assets/icons/yarn.svg';
import RadixImage from '../../assets/images/radix.png';
import TanStackRouterImage from '../../assets/images/tanstack-router.png';
import { FortuneTeller } from './FortuneTeller';
import { DefaultModels, ModelSelector } from './ModelSelector';
import { ServiceBox } from './ServiceBox';

const TanStackIcon = memo((props: HTMLProps<HTMLImageElement>) => <img src={TanStackRouterImage} alt='TanStack' {...props} />);
const RadixIconComponent = memo((props: HTMLProps<HTMLImageElement>) => <img src={RadixImage} alt='Radix' {...props} />);

interface ToolBoxProps {
  icon: ReactNode;
  name: string;
  description: string;
}

const ToolBox = ({ icon, name, description }: ToolBoxProps) => {
  return (
    <div className='bg-gray-200 dark:bg-[#2a2a2a] rounded-lg p-1.5 flex flex-col items-center justify-center border border-gray-400 dark:border-gray-600 gap-1'>
      <div className='w-5 h-5 rounded-sm overflow-hidden'>{icon}</div>
      <span className='mt-0.5 text-[11px] text-gray-800 dark:text-gray-200 text-center'>{name}</span>
      <span className='text-[9px] text-gray-600 dark:text-gray-400 text-center'>{description}</span>
    </div>
  );
};

const RepoBox = () => (
  <div className='border border-gray-400 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-[#1a1a1a] px-3 py-2 shadow-sm transition-all justify-center flex'>
    <a
      href='https://github.com/bebeal/vite-aws'
      target='_blank'
      rel='noopener noreferrer'
      className='flex items-center gap-2 text-gray-800 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white select-none'
    >
      <GithubIcon className='w-5 h-5' />
      <span className='text-base font-semibold whitespace-nowrap'>bebeal/vite-aws</span>
    </a>
  </div>
);

const DevToolsBox = () => (
  <div className='border border-gray-400 dark:border-gray-600 rounded-lg p-2 bg-gray-100 dark:bg-[#1a1a1a] shadow-sm transition-all flex flex-col gap-1'>
    <div className='grid grid-cols-3 gap-1'>
      <ToolBox icon={<ViteIcon className='w-5 h-5' />} name='Vite' description='Build Tool' />
      <ToolBox icon={<YarnIcon className='w-5 h-5' />} name='Yarn' description='Package Manager' />
      <ToolBox icon={<ESLintIcon className='w-5 h-5' />} name='ESLint' description='Linter' />
    </div>
    <div className='grid grid-cols-3 gap-1'>
      <ToolBox icon={<TypeScriptIcon className='w-5 h-5' />} name='TypeScript' description='Language' />
      <ToolBox icon={<PrettierIcon className='w-5 h-5' />} name='Prettier' description='Formatter' />
      <ToolBox icon={<VitestIcon className='w-5 h-5' />} name='Vitest' description='Testing' />
    </div>
    <div className='grid grid-cols-3 gap-1'>
      <div className='col-start-2'>
        <ToolBox icon={<GithubActionsIcon className='w-5 h-5' />} name='GitHub Actions' description='CI/CD' />
      </div>
    </div>
  </div>
);

const ClientToolsBox = () => (
  <div className='flex items-center justify-center z-10 w-[140px] h-[160px]'>
    <div className='border-2 border-cyan-500 rounded-lg p-1 bg-gray-100 dark:bg-[#1a1a1a] shadow-sm z-10'>
      <div className='flex flex-col gap-1'>
        <div className='grid grid-cols-2 gap-1'>
          <ToolBox icon={<ReactIcon className='w-5 h-5' />} name='React' description='Virtual DOM' />
          <ToolBox icon={<TanStackIcon className='w-5 h-5' />} name='TanStack' description='Router & Queries' />
          <ToolBox icon={<NodeIcon className='w-5 h-5' />} name='Node' description='Runtime' />
          <ToolBox icon={<TailwindIcon className='w-5 h-5' />} name='Tailwind' description='CSS' />
        </div>
        <div className='grid grid-cols-1 gap-1'>
          <ToolBox icon={<RadixIconComponent className='w-5 h-5' />} name='Radix' description='UI Components' />
        </div>
      </div>
    </div>
  </div>
);

// Component Box with consistent tracking implementation
const ComponentBox = ({ children, onPositionUpdate, id, className = '' }: ComponentProps) => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (ref.current) {
      const updatePosition = (): void => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          onPositionUpdate(id, rect, ref.current);
        }
      };

      updatePosition();
      const resizeObserver = new ResizeObserver(updatePosition);
      resizeObserver.observe(ref.current);

      return () => {
        if (ref.current) resizeObserver.unobserve(ref.current);
      };
    }
  }, [id, onPositionUpdate]);

  return (
    <div ref={ref} id={id} className={`${className}`}>
      {children}
    </div>
  );
};

// Define TypeScript interfaces
interface ComponentPosition {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}

interface PositionsState {
  [key: string]: ComponentPosition;
}

type ComponentProps = {
  children: React.ReactNode;
  onPositionUpdate: (id: string, rect: DOMRect, element: HTMLElement) => void;
  id: string;
  className?: string;
};

// Main Architecture Diagram component
export const ArchitectureDiagram = () => {
  const [positions, setPositions] = React.useState<PositionsState>({});
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const componentsRef = React.useRef<Map<string, HTMLElement>>(new Map());
  const [selectedModelId, setSelectedModelId] = React.useState<string>(DefaultModels[0].modelId);

  // Update component positions
  const updatePosition = React.useCallback((id: string, rect: DOMRect, element: HTMLElement): void => {
    setPositions((prev) => ({
      ...prev,
      [id]: rect as ComponentPosition,
    }));

    // Store the element reference for window resize handling
    componentsRef.current.set(id, element);
  }, []);

  // Function to update all registered component positions
  const updateAllPositions = React.useCallback((): void => {
    componentsRef.current.forEach((element, id) => {
      const rect = element.getBoundingClientRect();
      setPositions((prev) => ({
        ...prev,
        [id]: rect as ComponentPosition,
      }));
    });
  }, []);

  // Add window resize listener
  React.useEffect((): (() => void) => {
    const handleResize = (): void => {
      updateAllPositions();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateAllPositions]);

  // Draw the routes exactly as they appear in the original code
  const drawRoutes = (): JSX.Element[] | null => {
    if (!svgRef.current || Object.keys(positions).length < 6) return null;

    const svgRect = svgRef.current.getBoundingClientRect();
    const routes: JSX.Element[] = [];

    // Add the small route lines connecting client tools to client
    if (positions.client && positions.clientTools) {
      const clientX = positions.client.left + positions.client.width / 2 - svgRect.left;
      const clientY = positions.client.bottom - svgRect.top;
      const toolsY = positions.clientTools.top - svgRect.top;

      // Add the line from client to tools
      routes.push(<path key='client-tools-connection' d={`M ${clientX},${clientY} L ${clientX},${toolsY}`} stroke='#06b6d4' strokeWidth='2' fill='none' />);
    }

    if (positions.bedrock && positions.cdk) {
      const cdkStartX = positions.cdk.left + positions.cdk.width / 2 - svgRect.left;
      const cdkStartY = positions.cdk.bottom - svgRect.top;
      const bedrockContainerOffset = positions.bedrock.height * 0.4;
      const bedrockContainerTopY = positions.bedrock.top - bedrockContainerOffset - svgRect.top;

      routes.push(<path key='cdk-bedrock-connection' d={`M ${cdkStartX},${cdkStartY} L ${cdkStartX},${bedrockContainerTopY}`} stroke='#ec4899' strokeWidth='2' fill='none' />);

      const startY = bedrockContainerTopY + 37;
      routes.push(
        <path key='cdk-bedrock-connection-part2' d={`M ${cdkStartX},${startY} L ${cdkStartX},${bedrockContainerTopY + 19}`} stroke='#ec4899' strokeWidth='2' fill='none' />,
      );
    }

    if (positions.bedrock && positions.fortuneTeller) {
      const startX = positions.fortuneTeller.left - svgRect.left;
      const startY = positions.fortuneTeller.top + positions.fortuneTeller.height / 2 - svgRect.top;
      const endX = positions.bedrock.right - svgRect.left;
      const endY = positions.bedrock.top + positions.bedrock.height / 2 - svgRect.top;

      routes.push(
        <g key='fortune-bedrock-arrow'>
          <path d={`M ${startX},${startY} L ${endX},${endY}`} stroke='#00b8db' strokeWidth='2' fill='none' markerEnd='url(#arrowhead)' />
          <text x={(startX + endX) / 2} y={(startY + endY) / 2 - 8} textAnchor='middle' fill='#00b8db' fontSize='12' fontWeight='600'>
            /api/fortune
          </text>
        </g>,
      );
    }

    if (positions.client && positions.cloudfront) {
      const startX = positions.client.right - svgRect.left;
      const startY = positions.client.top + positions.client.height / 2 - svgRect.top;
      const endX = positions.cloudfront.left - svgRect.left;
      const endY = positions.cloudfront.top + positions.cloudfront.height / 2 - svgRect.top;

      routes.push(
        <g key='client-cloudfront'>
          <path d={`M ${startX},${startY} L ${endX},${endY}`} stroke='#06b6d4' strokeWidth='2' fill='none' markerEnd='url(#arrowhead)' />
          <text x={(startX + endX) / 2 + 4} y={(startY + endY) / 2 - 8} textAnchor='middle' dominantBaseline='middle' fill='#06b6d4' fontSize='12' fontWeight='600'>
            &lt;domain&gt;/*
          </text>
        </g>,
      );
    }

    if (positions.cloudfront && positions.s3) {
      const startX = positions.cloudfront.right - svgRect.left;
      const startY = positions.cloudfront.top + positions.cloudfront.height / 2 - svgRect.top;
      const endX = positions.s3.left - svgRect.left;
      const endY = positions.s3.top + positions.s3.height / 2 - svgRect.top;

      routes.push(
        <g key='cloudfront-s3'>
          <path d={`M ${startX},${startY} L ${endX},${endY}`} stroke='#06b6d4' strokeWidth='2' fill='none' markerEnd='url(#arrowhead)' />
          <text x={(startX + endX) / 2} y={(startY + endY) / 2 - 10} textAnchor='middle' fill='#06b6d4' fontSize='12' fontWeight='600'>
            /assets/*
          </text>
        </g>,
      );
    }

    if (positions.cloudfront && positions.apigateway) {
      const startX = positions.cloudfront.left + positions.cloudfront.width / 2 - svgRect.left;
      const startY = positions.cloudfront.bottom - svgRect.top;
      const endX = positions.apigateway.left + positions.apigateway.width / 2 - svgRect.left;
      const endY = positions.apigateway.top - svgRect.top;

      routes.push(
        <g key='cloudfront-apigateway'>
          <path
            d={`M ${startX},${startY} L ${startX},${(startY + endY) / 2} L ${endX},${(startY + endY) / 2} L ${endX},${endY}`}
            stroke='#06b6d4'
            strokeWidth='2'
            fill='none'
            markerEnd='url(#arrowhead)'
          />
          <text x={(startX + endX) / 2} y={(startY + endY) / 2 - 10} textAnchor='middle' fill='#06b6d4' fontSize='12' fontWeight='600'>
            /api/*
          </text>
        </g>,
      );
    }

    if (positions.apigateway && positions.lambda) {
      const startX = positions.apigateway.right - svgRect.left;
      const startY = positions.apigateway.top + positions.apigateway.height / 2 - svgRect.top;
      const endX = positions.lambda.left - svgRect.left;
      const endY = positions.lambda.top + positions.lambda.height / 2 - svgRect.top;

      routes.push(
        <g key='apigateway-lambda'>
          <path d={`M ${startX},${startY} L ${endX},${endY}`} stroke='#06b6d4' strokeWidth='2' fill='none' markerEnd='url(#arrowhead)' />
        </g>,
      );
    }

    if (positions.lambda && positions.express) {
      const startX = positions.lambda.right - svgRect.left;
      const startY = positions.lambda.top + positions.lambda.height / 2 - svgRect.top;
      const endX = positions.express.left - svgRect.left;
      const endY = positions.express.top + positions.express.height / 2 - svgRect.top;

      routes.push(
        <g key='lambda-express'>
          <path d={`M ${startX},${startY} L ${endX},${endY}`} stroke='#06b6d4' strokeWidth='2' fill='none' markerEnd='url(#arrowhead)' />
        </g>,
      );
    }

    if (positions.cdk && positions.express) {
      // Connect a line from the left of CDK to the pink vertical border
      const cdkX = positions.cdk.left - svgRect.left;
      const cdkY = positions.cdk.top + positions.cdk.height / 2 - svgRect.top;

      // Calculate distance between CDK and Express
      const distance = Math.abs(cdkX - (positions.express.right - svgRect.left));

      // Use a percentage of that distance to find border position so it scales with the page
      const borderX = positions.express.right - svgRect.left + distance * 0.62;

      routes.push(
        <g key='cdk-bedrock'>
          <path d={`M ${cdkX},${cdkY} L ${borderX},${cdkY}`} stroke='#ec4899' strokeWidth='2' fill='none' />
        </g>,
      );
    }

    if (positions.modelSelector && positions.bedrock) {
      const startX = positions.modelSelector.right - svgRect.left;
      const startY = positions.modelSelector.top + positions.modelSelector.height / 2 - svgRect.top;
      const endX = positions.bedrock.left - svgRect.left;
      const endY = positions.bedrock.top + positions.bedrock.height / 2 - svgRect.top;

      routes.push(
        <g key='modelSelector-bedrock'>
          <path d={`M ${endX},${endY} L ${startX},${startY}`} stroke='#00b8db' strokeWidth='2' fill='none' markerEnd='url(#arrowhead)' />
        </g>,
      );
    }

    return routes;
  };

  return (
    <div className='w-full flex flex-col items-center py-6 bg-gray-200 dark:bg-[#2a2a2a] transition-all overflow-hidden'>
      <div className='w-auto flex gap-8'>
        {/* Left section: Repository and Dev Tools */}
        <div className='flex flex-col shrink-0'>
          <RepoBox />
          {/* Vertical connecting line */}
          <div className='w-[1px] h-16 bg-gray-400 dark:bg-gray-600 mx-auto relative'>
            {/* Horizontal line from middle */}
            <div className='absolute top-1/2 right-0 w-[210px] border-t border-gray-400 dark:border-gray-600 translate-x-full'></div>
          </div>
          <DevToolsBox />
        </div>

        {/* Main Architecture Diagram - Fixed grid layout */}
        <div className='flex-1 flex flex-col'>
          <div className='border border-gray-400 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-[#1a1a1a] p-4 relative shadow-sm'>
            {/* SVG for connections */}
            <svg ref={svgRef} className='absolute inset-0 w-full h-full pointer-events-none overflow-visible z-9'>
              <defs>
                <marker id='arrowhead' markerWidth='3' markerHeight='3' refX='1' refY='1.5' orient='auto'>
                  <polygon points='0 0, 1.8 1.5, 0 3' fill='#06b6d4' />
                </marker>
                <marker id='pinkArrowhead' markerWidth='3' markerHeight='3' refX='1' refY='1.5' orient='auto'>
                  <polygon points='0 0, 1.8 1.5, 0 3' fill='#ec4899' />
                </marker>
              </defs>
              {drawRoutes()}
            </svg>

            {/* Main content with fixed grid layout to prevent alignment issues */}
            <div className='grid grid-cols-12 gap-x-8 relative'>
              {/* Client Browser */}
              <div className='col-span-2 flex flex-col items-center'>
                <div className='mt-[18px]'>
                  <ComponentBox id='client' onPositionUpdate={updatePosition} className='relative z-10'>
                    <ServiceBox icon={<WebIcon className='w-12 h-12' />} name='Web' description='Client Browser' className='border-2 border-cyan-500 dark:border-cyan-500' />
                  </ComponentBox>
                </div>
                <div className='mt-10'>
                  <ComponentBox id='clientTools' onPositionUpdate={updatePosition}>
                    <ClientToolsBox />
                  </ComponentBox>
                </div>
              </div>

              {/* Middle section */}
              <div className='col-span-8 flex flex-col justify-center gap-36 relative'>
                <div className='absolute right-0 top-[10%] bottom-[10%] border-r-2 border-pink-500' />
                {/* Static stack */}
                <div className='border-2 border-pink-500 rounded-lg p-4 relative shadow-sm'>
                  <div className='absolute -top-3 left-4 bg-gray-100 dark:bg-[#1a1a1a] px-2 text-xs text-pink-500 font-medium'>vite-aws-static</div>
                  <div className='grid grid-cols-2 justify-items-center'>
                    <ComponentBox id='cloudfront' onPositionUpdate={updatePosition}>
                      <ServiceBox icon={<CloudFrontIcon className='w-12 h-12' />} name='CloudFront' description='Content Delivery' />
                    </ComponentBox>

                    <ComponentBox id='s3' onPositionUpdate={updatePosition}>
                      <ServiceBox icon={<S3Icon className='w-12 h-12' />} name='S3' description='Static Assets' />
                    </ComponentBox>
                  </div>
                </div>

                {/* API stack */}
                <div className='border-2 border-pink-500 rounded-lg p-4 relative shadow-sm'>
                  <div className='absolute -top-3 left-4 bg-gray-100 dark:bg-[#1a1a1a] px-2 text-xs text-pink-500 font-medium'>vite-aws-api</div>
                  <div className='grid grid-cols-3 justify-items-center'>
                    <ComponentBox id='apigateway' onPositionUpdate={updatePosition}>
                      <ServiceBox icon={<APIGatewayIcon className='w-12 h-12' />} name='API Gateway' description='REST API' />
                    </ComponentBox>

                    <ComponentBox id='lambda' onPositionUpdate={updatePosition}>
                      <ServiceBox icon={<LambdaIcon className='w-12 h-12' />} name='Lambda' description='Serverless Compute' />
                    </ComponentBox>

                    <ComponentBox id='express' onPositionUpdate={updatePosition}>
                      <ServiceBox icon={<ExpressIcon className='w-12 h-12' />} name='Express' description='API Router' />
                    </ComponentBox>
                  </div>
                </div>
              </div>

              {/* CDK box */}
              <div className='col-span-2 flex items-center justify-center'>
                <ComponentBox id='cdk' onPositionUpdate={updatePosition} className='relative'>
                  <ServiceBox icon={<CDKIcon className='w-12 h-12' />} name='CDK' description='Infrastructure as Code' className='border-2 border-pink-500 dark:border-pink-500' />
                </ComponentBox>
              </div>
            </div>
          </div>

          {/* Bedrock Agent Section */}
          <div className='border border-gray-400 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-[#1a1a1a] p-4 mt-4 shadow-sm transition-all'>
            <div className='border-2 border-pink-500 rounded-lg p-4 relative shadow-sm max-w-[930px] mx-auto left-2'>
              <div className='absolute -top-3 left-4 bg-gray-100 dark:bg-[#1a1a1a] px-2 text-xs text-pink-500 font-medium'>vite-aws-agents</div>
              <div className='flex justify-center gap-30 grid-cols-3 w-full'>
                <div className='flex items-center gap-4'>
                  {/* Model Selector */}
                  <ComponentBox id='modelSelector' onPositionUpdate={updatePosition}>
                    <ModelSelector onModelSelect={setSelectedModelId} />
                  </ComponentBox>
                  <ComponentBox id='bedrock' onPositionUpdate={updatePosition}>
                    <ServiceBox
                      icon={<BedrockIcon className='w-12 h-12' />}
                      name='Bedrock'
                      description={
                        <span className='text-xs text-gray-600 dark:text-gray-400 text-center'>
                          AI Agents
                          <br />& Models
                        </span>
                      }
                    />
                  </ComponentBox>
                </div>

                {/* Fortune teller */}
                <ComponentBox id='fortuneTeller' onPositionUpdate={updatePosition} className='flex items-center'>
                  <FortuneTeller modelId={selectedModelId} />
                </ComponentBox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
