import { useCallback, useEffect, useRef, useState } from 'react';
import APIGatewayIcon from '../assets/icons/apigateway.svg';
import CDKIcon from '../assets/icons/cdk.svg';
import CloudFrontIcon from '../assets/icons/cloudfront.svg';
import ESLintIcon from '../assets/icons/eslint.svg';
import ExpressIcon from '../assets/icons/express.svg';
import GithubIcon from '../assets/icons/github.svg';
import LambdaIcon from '../assets/icons/lambda.svg';
import NodeIcon from '../assets/icons/node.svg';
import PrettierIcon from '../assets/icons/prettier.svg';
import ReactIcon from '../assets/icons/react.svg';
import S3Icon from '../assets/icons/s3.svg';
import TailwindIcon from '../assets/icons/tailwind.svg';
import TypeScriptIcon from '../assets/icons/typescript.svg';
import ViteIcon from '../assets/icons/vite.svg';
import WebIcon from '../assets/icons/web.svg';
import YarnIcon from '../assets/icons/yarn.svg';
import TanStackRouterIcon from '../assets/images/tanstack-router.png';

type Point = { x: number; y: number };

// Helper to calculate bezier curve control points
const calculateControlPoints = (start: Point, end: Point, type: 'straight' | 'diagonal') => {
  if (type === 'straight') {
    return {
      cp1: { x: start.x + (end.x - start.x) * 0.5, y: start.y },
      cp2: { x: start.x + (end.x - start.x) * 0.5, y: end.y }
    };
  }
  // For CloudFront to API Gateway connection - vertical first, then horizontal
  return {
    cp1: { x: start.x, y: start.y + (end.y - start.y) * 0.5 }, // Go down vertically first
    cp2: { x: end.x, y: start.y + (end.y - start.y) * 0.5 }    // Then go horizontally to target
  };
};

const Arrow = ({
  start,
  end,
  label,
  type = 'straight'
}: {
  start: Point;
  end: Point;
  label?: string;
  type?: 'straight' | 'diagonal';
}) => {
  let path;
  let labelX;
  let labelY;

  if (type === 'straight') {
    const { cp1, cp2 } = calculateControlPoints(start, end, type);
    path = `M ${start.x},${start.y} L ${cp1.x},${cp1.y} L ${cp2.x},${cp2.y} L ${end.x},${end.y}`;
    labelX = (start.x + end.x) / 2;
    labelY = (start.y + end.y) / 2 - 10;
  } else {
    // Three straight lines: down from start, horizontal connection, up to end
    const verticalOffset = (end.y - start.y) / 2; // Meet halfway between the two components
    path = `M ${start.x},${start.y}
            L ${start.x},${start.y + verticalOffset}
            L ${end.x},${start.y + verticalOffset}
            L ${end.x},${end.y}`.replace(/\n\s+/g, ' ');
    labelX = (start.x + end.x) / 2;
    labelY = start.y + verticalOffset - 10;
  }

  return (
    <>
      <path
        d={path}
        strokeWidth="1.5"
        fill="none"
        markerEnd="url(#arrowhead)"
        className="stroke-cyan-500 dark:stroke-cyan-500"
      />
      {label && (
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          fontSize="11"
          fontWeight="500"
          className="text-cyan-500 dark:fill-cyan-500"
        >
          {label}
        </text>
      )}
    </>
  );
};

const ComponentBox = ({
  children,
  onPositionUpdate,
  id,
  className = ''
}: {
  children: React.ReactNode;
  id: string;
  onPositionUpdate: (id: string, rect: DOMRect) => void;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const updatePosition = () => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) onPositionUpdate(id, rect);
      };

      updatePosition();
      let timeoutId: NodeJS.Timeout;
      const handleResize = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(updatePosition, 0);
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(timeoutId);
      };
    }
  }, [id, onPositionUpdate]);

  const borderStyles = className.includes('border') ? '' : "border border-gray-400 dark:border-gray-600";

  return (
    <div
      ref={ref}
      className={`relative bg-gray-200 dark:bg-[#2a2a2a] rounded-lg p-3 flex flex-col items-center w-[130px] h-[130px] justify-center ${borderStyles} ${className}`}
    >
      {children}
    </div>
  );
};

export const ArchitectureDiagram = () => {
  const [positions, setPositions] = useState<Map<string, DOMRect>>(new Map());
  const svgRef = useRef<SVGSVGElement>(null);

  // Memoize the updatePosition function
  const updatePosition = useCallback((id: string, rect: DOMRect) => {
    setPositions(prev => {
      const newPositions = new Map(prev);
      newPositions.set(id, rect);
      return newPositions;
    });
  }, []); // Empty dependency array since it only uses setState

  const getConnectionPoints = (fromId: string, toId: string): { start: Point; end: Point } | null => {
    const fromRect = positions.get(fromId);
    const toRect = positions.get(toId);

    if (!fromRect || !toRect || !svgRef.current) return null;

    const svgRect = svgRef.current.getBoundingClientRect();

    // Special case for CloudFront to API Gateway
    if (fromId === 'cloudfront' && toId === 'apigateway') {
      return {
        start: {
          x: fromRect.left + fromRect.width/2 - svgRect.left, // Center of CloudFront
          y: fromRect.bottom - svgRect.top // Bottom of CloudFront
        },
        end: {
          x: toRect.left + toRect.width/2 - svgRect.left, // Center top of API Gateway
          y: toRect.top - svgRect.top // Top of API Gateway
        }
      };
    }

    // Default case for other connections
    return {
      start: {
        x: fromRect.right - svgRect.left,
        y: fromRect.top + fromRect.height/2 - svgRect.top
      },
      end: {
        x: toRect.left - svgRect.left,
        y: toRect.top + toRect.height/2 - svgRect.top
      }
    };
  };

  const connections = [
    { from: 'client', to: 'cloudfront', label: '<domain>/*', type: 'straight' as const },
    { from: 'cloudfront', to: 's3', label: '/assets/*', type: 'straight' as const },
    { from: 'cloudfront', to: 'apigateway', label: '/api/*', type: 'diagonal' as const },
    { from: 'apigateway', to: 'lambda', type: 'straight' as const },
    { from: 'lambda', to: 'express', type: 'straight' as const }
  ];

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center py-4 bg-gray-200 dark:bg-[#2a2a2a] transition-all">
      <div className="w-full max-w-[1200px] flex gap-8">
        {/* Left Side - GitHub and Dev Tools */}
        <div className="flex flex-col w-[200px]">
          {/* Repository Box */}
          <div className="border border-gray-400 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-[#1a1a1a] px-3 py-2 shadow-sm transition-all">
            <a href="https://github.com/bebeal/vite-aws" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-800 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white select-none">
              <GithubIcon className="w-5 h-5" />
              <span className="text-base font-semibold whitespace-nowrap">bebeal/vite-aws</span>
            </a>
          </div>

          {/* Vertical connecting line */}
          <div className="w-[1px] h-16 bg-gray-400 dark:bg-gray-600 mx-auto relative">
            {/* Horizontal line from middle */}
            <div className="absolute top-1/2 right-0 w-[200px] border-t border-gray-400 dark:border-gray-600 translate-x-full"></div>
          </div>

          {/* Development tools */}
          <div className="border border-gray-400 dark:border-gray-600 rounded-lg p-2 bg-gray-100 dark:bg-[#1a1a1a] shadow-sm transition-all">
            {/* Grid container for dev tools */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-200 dark:bg-[#2a2a2a] rounded-lg p-1.5 flex flex-col items-center justify-center w-[90px]">
                <ViteIcon className="w-5 h-5" />
                <span className="mt-0.5 text-[11px] text-gray-800 dark:text-gray-200">Vite</span>
                <span className="text-[9px] text-gray-600 dark:text-gray-400 text-center">Build Tool</span>
              </div>
              <div className="bg-gray-200 dark:bg-[#2a2a2a] rounded-lg p-1.5 flex flex-col items-center justify-center w-[90px]">
                <YarnIcon className="w-5 h-5" />
                <span className="mt-0.5 text-[11px] text-gray-800 dark:text-gray-200">Yarn</span>
                <span className="text-[9px] text-gray-600 dark:text-gray-400 text-center text-nowrap">Package Manager</span>
              </div>
              <div className="bg-gray-200 dark:bg-[#2a2a2a] rounded-lg p-1.5 flex flex-col items-center justify-center w-[90px]">
                <ESLintIcon className="w-5 h-5" />
                <span className="mt-0.5 text-[11px] text-gray-800 dark:text-gray-200">ESLint</span>
                <span className="text-[9px] text-gray-600 dark:text-gray-400 text-center">Linter</span>
              </div>
              <div className="bg-gray-200 dark:bg-[#2a2a2a] rounded-lg p-1.5 flex flex-col items-center justify-center w-[90px]">
                <PrettierIcon className="w-5 h-5" />
                <span className="mt-0.5 text-[11px] text-gray-800 dark:text-gray-200">Prettier</span>
                <span className="text-[9px] text-gray-600 dark:text-gray-400 text-center">Formatter</span>
              </div>
              <div className="col-span-2 flex justify-center">
                <div className="bg-gray-200 dark:bg-[#2a2a2a] rounded-lg p-1.5 flex flex-col items-center justify-center w-[90px]">
                  <TypeScriptIcon className="w-5 h-5" />
                  <span className="mt-0.5 text-[11px] text-gray-800 dark:text-gray-200">TypeScript</span>
                  <span className="text-[9px] text-gray-600 dark:text-gray-400 text-center">Language</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Architecture Diagram */}
        <div className="flex-1 aspect-[2/1] border border-gray-400 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-[#1a1a1a] p-4 relative shadow-sm transition-all">
          {/* SVG Container for Arrows */}
          <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="4"
                markerHeight="4"
                refX="4"
                refY="2"
                orient="auto"
              >
                <polygon points="0 0, 4 2, 0 4" className="fill-cyan-500" />
              </marker>
            </defs>
            {connections.map(({ from, to, label, type }) => {
              const points = getConnectionPoints(from, to);
              if (!points) return null;
              return (
                <Arrow
                  key={`${from}-${to}`}
                  start={points.start}
                  end={points.end}
                  label={label}
                  type={type}
                />
              );
            })}
          </svg>

          {/* Main Content Grid */}
          <div className="grid grid-cols-12 gap-8 h-full">
            {/* Left Column - Client with its technologies */}
            <div className="col-span-2 flex flex-col h-full relative">
              {/* Top: Client Web Browser */}
              <div className="flex justify-center mt-[18px]">
                <ComponentBox id="client" onPositionUpdate={updatePosition} className="border-2 border-cyan-500 dark:border-cyan-500 relative z-10">
                  <WebIcon className="w-12 h-12" />
                  <span className="mt-2 text-sm font-bold text-gray-800 dark:text-gray-200">Client</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 text-center font-bold">Web<br />Browser</span>
                </ComponentBox>
              </div>

              {/* Vertical connecting line */}
              <div className="absolute left-1/2 top-[147px] bottom-[50%] border-l-2 border-cyan-500" />

              {/* Client Deps */}
              <div className="flex-1 flex items-center justify-center z-10">
                <div className="border-2 border-cyan-500 rounded-lg p-1 bg-gray-100 dark:bg-[#1a1a1a] shadow-sm">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="bg-gray-200 dark:bg-[#2a2a2a] rounded-lg p-1.5 flex flex-col items-center">
                      <ReactIcon className="w-5 h-5" />
                      <span className="mt-0.5 text-[11px] text-gray-800 dark:text-gray-200">React</span>
                      <span className="text-[9px] text-gray-600 dark:text-gray-400 text-center">virtual DOM</span>
                    </div>
                    <div className="bg-gray-200 dark:bg-[#2a2a2a] rounded-lg p-1.5 flex flex-col items-center">
                      <img src={TanStackRouterIcon} className="w-5 h-5" />
                      <span className="mt-0.5 text-[11px] text-gray-800 dark:text-gray-200 text-center">TanStack<br />Router</span>
                      <span className="text-[9px] text-gray-600 dark:text-gray-400 text-center">Nav</span>
                    </div>
                    <div className="bg-gray-200 dark:bg-[#2a2a2a] rounded-lg p-1.5 flex flex-col items-center">
                      <NodeIcon className="w-5 h-5" />
                      <span className="mt-0.5 text-[11px] text-gray-800 dark:text-gray-200">Node</span>
                      <span className="text-[9px] text-gray-600 dark:text-gray-400 text-center">Runtime</span>
                    </div>
                    <div className="bg-gray-200 dark:bg-[#2a2a2a] rounded-lg p-1.5 flex flex-col items-center">
                      <TailwindIcon className="w-5 h-5" />
                      <span className="mt-0.5 text-[11px] text-gray-800 dark:text-gray-200">Tailwind</span>
                      <span className="text-[9px] text-gray-600 dark:text-gray-400 text-center">CSS</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom: Empty space */}
              <div className="h-[130px]"></div>
            </div>

            {/* Middle Column - Stacks */}
            <div className="col-span-8 flex flex-col justify-between relative">
              {/* Add a vertical line connecting the boxes */}
              <div className="absolute right-0 top-[10%] bottom-[10%] border-r-2 border-pink-500" />
              {/* Add horizontal line to CDK */}
              <div className="absolute right-0 top-1/2 border-t-2 border-pink-500 w-[32px] translate-x-full" />

              {/* Static Stack */}
              <div className="border-2 border-pink-500 rounded-lg p-4 relative shadow-sm">
                <div className="absolute -top-3 right-4 bg-gray-100 dark:bg-[#1a1a1a] px-2 text-xs text-pink-500 font-medium">
                  vite-aws-static
                </div>
                <div className="flex justify-center gap-32">
                  <ComponentBox id="cloudfront" onPositionUpdate={updatePosition}>
                    <CloudFrontIcon className="w-12 h-12" />
                    <span className="mt-2 text-sm font-bold text-gray-800 dark:text-gray-200">CloudFront</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400 text-center font-bold">Content<br />Delivery</span>
                  </ComponentBox>

                  <ComponentBox id="s3" onPositionUpdate={updatePosition}>
                    <S3Icon className="w-12 h-12" />
                    <span className="mt-2 text-sm font-bold text-gray-800 dark:text-gray-200">S3 Bucket</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400 text-center font-bold">Static<br />Assets</span>
                  </ComponentBox>
                </div>
              </div>

              {/* API Stack */}
              <div className="border-2 border-pink-500 rounded-lg p-4 relative shadow-sm">
                <div className="absolute -top-3 right-4 bg-gray-100 dark:bg-[#1a1a1a] px-2 text-xs text-pink-500 font-medium">
                  vite-aws-api
                </div>
                <div className="flex justify-center gap-16">
                  <ComponentBox id="apigateway" onPositionUpdate={updatePosition}>
                    <APIGatewayIcon className="w-12 h-12" />
                    <span className="mt-2 text-sm font-bold text-gray-800 dark:text-gray-200">API Gateway</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400 text-center font-bold">REST API</span>
                  </ComponentBox>

                  <ComponentBox id="lambda" onPositionUpdate={updatePosition}>
                    <LambdaIcon className="w-12 h-12" />
                    <span className="mt-2 text-sm font-bold text-gray-800 dark:text-gray-200">Lambda</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400 text-center font-bold">Serverless<br />Compute</span>
                  </ComponentBox>

                  <ComponentBox id="express" onPositionUpdate={updatePosition}>
                    <ExpressIcon className="w-12 h-12" />
                    <span className="mt-2 text-sm font-bold text-gray-800 dark:text-gray-200">Express</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400 text-center font-bold">API<br />Router</span>
                  </ComponentBox>
                </div>
              </div>
            </div>

            {/* Right Column - CDK */}
            <div className="col-span-2 flex items-center justify-center">
              <ComponentBox id="cdk" onPositionUpdate={updatePosition} className="border-2 border-pink-500 dark:border-pink-500 relative">
                <CDKIcon className="w-12 h-12" />
                <span className="mt-2 text-sm font-bold text-gray-800 dark:text-gray-200">CDK</span>
                <span className="text-xs text-gray-600 dark:text-gray-400 text-center font-bold">Infrastructure<br />as Code</span>
              </ComponentBox>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

