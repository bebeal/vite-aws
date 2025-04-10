import { FoundationModelSummary } from '@aws-sdk/client-bedrock';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useQuery } from '@tanstack/react-query';
import React, { SVGProps, useState } from 'react';
import AmazonIcon from '../../assets/icons/amazon.svg';
import AnthropicIcon from '../../assets/icons/anthropic.svg';
import CohereIcon from '../../assets/icons/cohere.svg';
import DeepSeekIcon from '../../assets/icons/deepseek.svg';
import MetaIcon from '../../assets/icons/meta.svg';
import MistralIcon from '../../assets/icons/mistral.svg';
import OpenAIIcon from '../../assets/icons/openai.svg';
import StabilityAI from '../../assets/icons/stability.svg';
import Ai21Image from '../../assets/images/ai21labs.jpeg';
import Claude37SonnetImage from '../../assets/images/claude3_7.png';
import LumaImage from '../../assets/images/luma.png';
import { Loader } from '../Loader/Loader';
import { ServiceBox } from '../ServiceBox/ServiceBox';
// model icons
const Claude37SonnetIcon = (props: React.HTMLAttributes<HTMLImageElement>) => <img src={Claude37SonnetImage} alt='claude37sonnet' {...props} />;

// provider icons
const Ai21Icon = (props: React.HTMLAttributes<HTMLImageElement>) => <img src={Ai21Image} alt='ai21' {...props} />;
const LumaIcon = (props: React.HTMLAttributes<HTMLImageElement>) => <img src={LumaImage} alt='luma' {...props} />;

const providerIcons = {
  Anthropic: (props: SVGProps<SVGSVGElement>) => <AnthropicIcon {...props} />,
  Amazon: (props: SVGProps<SVGSVGElement>) => <AmazonIcon {...props} />,
  Cohere: (props: SVGProps<SVGSVGElement>) => <CohereIcon {...props} />,
  DeepSeek: (props: SVGProps<SVGSVGElement>) => <DeepSeekIcon {...props} />,
  Meta: (props: SVGProps<SVGSVGElement>) => <MetaIcon {...props} />,
  'Stability AI': (props: SVGProps<SVGSVGElement>) => <StabilityAI {...props} />,
  'Mistral AI': (props: SVGProps<SVGSVGElement>) => <MistralIcon {...props} />,
  Deepseek: (props: SVGProps<SVGSVGElement>) => <DeepSeekIcon {...props} />,
  ai21: (props: React.HTMLAttributes<HTMLImageElement>) => <Ai21Icon {...props} />,
  'Luma AI': (props: React.HTMLAttributes<HTMLImageElement>) => <LumaIcon {...props} />,
  OpenAI: (props: SVGProps<SVGSVGElement>) => <OpenAIIcon {...props} />,
};

const modelIcons = {
  'anthropic.claude-3-7-sonnet-20250219-v1:0': <Claude37SonnetIcon className='w-3 h-3 object-contain' style={{ marginTop: '-1px' }} />,
  'deepseek.r1-v1:0': <DeepSeekIcon className='w-3 h-3' />,
} as const;

type ModelId = keyof typeof modelIcons;

const DefaultModels = [
  {
    customizationsSupported: [],
    inferenceTypesSupported: [
      'INFERENCE_PROFILE',
      // for some reason this is not a valid InferenceType but it's the output of list foundation models so ¯\_(ツ)_/¯
    ] as unknown as FoundationModelSummary['inferenceTypesSupported'],
    inputModalities: ['TEXT'],
    modelArn: 'arn:aws:bedrock:us-west-2::foundation-model/deepseek.r1-v1:0',
    modelId: 'deepseek.r1-v1:0',
    modelLifecycle: {
      status: 'ACTIVE',
    },
    modelName: 'DeepSeek-R1',
    outputModalities: ['TEXT'],
    providerName: 'DeepSeek',
    responseStreamingSupported: true,
  },
] satisfies FoundationModelSummary[];

// Update ModelNameWithIcon to fix icon positioning
const ModelNameWithIcon = ({ modelId, name }: { modelId: ModelId; name: string }) => {
  if (modelId in modelIcons) {
    // Extract first word to show icon before it
    const firstWord = name.split(' ')[0];
    const restOfName = name.substring(firstWord.length);

    return (
      <div className='break-words'>
        <span className='inline-flex items-center gap-1 align-middle'>
          <span className='flex-shrink-0'>{modelIcons[modelId]}</span>
          <span>{firstWord}</span>
        </span>
        {restOfName}
      </div>
    );
  }
  return <span className='break-words'>{name}</span>;
};

const isModelId = (id: string): id is ModelId => id in modelIcons;

// Create a ProviderIcon component to properly render the icons
const ProviderIcon = ({ providerName, className }: { providerName: string; className?: string }) => {
  const IconComponent = providerIcons[providerName as keyof typeof providerIcons];
  if (!IconComponent) return <div className={className} />;

  return <IconComponent className={className} />;
};

// Modify the isEnabled function
const isEnabled = (model: FoundationModelSummary) => {
  return model.inputModalities?.includes('TEXT') && model.modelId !== undefined && (model?.modelName?.includes('Claude') || model?.modelName?.includes('DeepSeek'));
};

// Create 'shouldRemoveModel' function
const shouldRemoveModel = (model: FoundationModelSummary) => {
  // Add logic to determine if the model should be removed
  return !model?.outputModalities?.includes('TEXT') || model?.inferenceTypesSupported?.includes('PROVISIONED') || model?.modelLifecycle?.status !== 'ACTIVE';
};
export const ModelSelector = ({ onModelSelect }: { onModelSelect: (modelId: string) => void }) => {
  const [selectedModel, setSelectedModel] = useState<FoundationModelSummary | null>(DefaultModels[0]);
  const [hasOpened, setHasOpened] = useState(false);

  const { data: models = [], isPending } = useQuery({
    queryKey: ['bedrockModels'],
    queryFn: async () => {
      const response = await fetch('/api/models');
      if (!response.ok) throw new Error('Failed to fetch models');
      const data = await response.json();

      // Process models
      const modelsArray = Object.values(data.models) as FoundationModelSummary[];
      const filteredModels = modelsArray.filter((model) => !shouldRemoveModel(model));

      // Deduplicate
      const uniqueModelsMap = new Map<string, FoundationModelSummary>();
      filteredModels.forEach((model) => {
        if (model.modelId) {
          const baseModelId = model.modelId.split(':')[0];
          if (!uniqueModelsMap.has(baseModelId)) {
            uniqueModelsMap.set(baseModelId, model);
          }
        }
      });

      return Array.from(uniqueModelsMap.values());
    },
    enabled: hasOpened,
  });

  const handleModelSelect = (model: FoundationModelSummary) => {
    if (!isEnabled(model)) {
      return; // Don't allow selection of non-enabled models
    }
    setSelectedModel(model);
    if (model.modelId) {
      onModelSelect(model.modelId);
      setSelectedModel(model);
    }
  };

  return (
    <DropdownMenu.Root
      onOpenChange={(open) => {
        if (open && !hasOpened) {
          setHasOpened(true);
        }
      }}
    >
      <DropdownMenu.Trigger asChild>
        <div className='relative cursor-pointer'>
          <ServiceBox
            icon={selectedModel && selectedModel.providerName ? <ProviderIcon providerName={selectedModel.providerName} className='w-12 h-12' /> : <div className='w-12 h-12' />}
            name={selectedModel?.providerName || 'Select a provider'}
            description={
              selectedModel?.modelId && isModelId(selectedModel.modelId) ? (
                <ModelNameWithIcon modelId={selectedModel.modelId} name={selectedModel.modelName || ''} />
              ) : (
                selectedModel?.modelName || 'Choose a model'
              )
            }
            className='h-[140px]' // Match Bedrock height
          />

          {/* Dropdown indicator */}
          <div className='absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-700'>
            <svg className='w-3 h-3 text-gray-600 dark:text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
            </svg>
          </div>
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className='min-w-[280px] max-h-[400px] overflow-y-auto bg-white dark:bg-[#2a2a2a] rounded-xl shadow-lg p-2 z-50 border-2 border-gray-400 dark:border-gray-600'
          sideOffset={5}
        >
          {isPending ? (
            <div className='flex justify-center items-center py-4'>
              <Loader />
            </div>
          ) : (
            models.map((model: FoundationModelSummary) => {
              const isTextModel = isEnabled(model);
              const itemClassName = `flex items-center gap-3 px-3 py-2 text-sm rounded-lg outline-none ${
                isTextModel ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer' : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`;

              return (
                <DropdownMenu.Item key={model.modelId} className={itemClassName} onSelect={() => handleModelSelect(model)} disabled={!isTextModel}>
                  <div className='w-6 h-6 flex-shrink-0'>
                    {model.providerName ? (
                      <ProviderIcon providerName={model.providerName} className={`w-6 h-6 ${!isTextModel ? 'opacity-50' : ''}`} />
                    ) : (
                      <div className='w-6 h-6 rounded bg-gray-200 dark:bg-gray-700' />
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='font-medium'>{model.providerName}</div>
                    <div className='flex justify-between gap-2'>
                      <div className='break-words pr-2 min-w-0'>
                        {model.modelId && isModelId(model.modelId) ? (
                          <ModelNameWithIcon modelId={model.modelId} name={model.modelName || ''} />
                        ) : (
                          <span className='break-words'>{model.modelName}</span>
                        )}
                      </div>
                      <div className='text-right flex-shrink-0'>
                        {model.outputModalities?.map((modality: string) => {
                          return (
                            <div key={modality} className='text-[10px] font-mono opacity-75'>
                              {modality.toLowerCase()}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </DropdownMenu.Item>
              );
            })
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
