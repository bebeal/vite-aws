import { Loader } from '../Loader/Loader';
import { useMutation } from '@tanstack/react-query';

export const FortuneTeller = () => {
  const fetchFortune = async () => {
    const response = await fetch('/api/fortune');
    if (!response.ok) {
      throw new Error('Failed to fetch fortune');
    }
    const data = await response.json();
    return data.fortune;
  };

  const {
    mutate,
    isPending,
    data: fortune,
    error,
  } = useMutation({
    mutationFn: fetchFortune,
  });

  // Display text is either the fortune or error message
  const displayText = error ? error.message : fortune;

  return (
    <div className='flex items-center justify-center transition-all duration-200' id='fortuneTeller'>
      <button
        onClick={() => mutate()}
        disabled={isPending}
        className='h-10 flex-shrink-0 px-4 py-2 min-w-37 text-sm font-medium text-white bg-[#1a1a1a] rounded-md hover:bg-[#222222] disabled:bg-[#1a1a1a] disabled:cursor-not-allowed cursor-pointer border border-gray-600 hover:border-purple-500 flex items-center justify-center gap-2 peer'
      >
        {isPending ? <Loader /> : <>🔮 Get Fortune</>}
      </button>

      {displayText ? (
        <>
          <div className='h-[1px] w-8 bg-gray-600 peer-hover:bg-purple-500'></div>
          <div className='max-w-[300px] p-4 bg-[#1a1a1a] rounded-md shadow-lg text-sm border border-gray-600 peer-hover:border-purple-500'>
            <p className={`text-gray-200 font-medium whitespace-normal text-xs text-center flex items-center justify-center ${error ? 'text-red-500' : ''}`}>
              {error ? (
                <span>{displayText}</span>
              ) : (
                <span className='inline-flex items-center'>
                  🥠<span className='mx-1'>{displayText.replace(/🥠/g, '')}</span>🥠
                </span>
              )}
            </p>
          </div>
        </>
      ) : (
        <div className='w-[332px]' />
      )}
    </div>
  );
};
