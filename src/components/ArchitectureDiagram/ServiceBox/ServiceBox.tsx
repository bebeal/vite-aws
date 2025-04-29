import { ReactNode } from 'react';

interface ServiceBoxProps {
  icon: ReactNode;
  name: ReactNode;
  description: ReactNode;
  className?: string;
}

export const ServiceBox = ({ icon, name, description, className = '' }: ServiceBoxProps) => {
  const borderStyles = className?.includes('border') ? '' : 'border-2 border-gray-400 dark:border-gray-600';
  return (
    <div
      className={`relative overflow-hidden bg-gray-200 dark:bg-[#2a2a2a] rounded-lg p-3 flex flex-col items-center w-[140px] min-h-[140px] justify-center shrink-0 border ${borderStyles} ${className}`}
    >
      <div className='w-12 h-12 rounded-lg'>{icon}</div>
      <span className='mt-2 text-sm font-bold text-gray-800 dark:text-gray-200 break-all text-center'>{name}</span>
      <span className='text-xs text-gray-600 dark:text-gray-400 text-center font-bold'>
        {typeof description === 'string'
          ? description.split(' ').map((word, index) => (
              <span key={index}>
                {word} {index === 0 && <br />}
              </span>
            ))
          : description}
      </span>
    </div>
  );
};
