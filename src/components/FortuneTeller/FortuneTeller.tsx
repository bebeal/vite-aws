import { useState } from "react";

export const FortuneTeller = () => {
  const [fortune, setFortune] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getFortune = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/fortune');
      const data = await response.json();
      setFortune(data.fortune);
    } catch (error) {
      console.error('Error fetching fortune:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center transition-all duration-200" id="fortuneTeller">
      <button
        onClick={getFortune}
        disabled={loading}
        className="h-10 flex-shrink-0 px-4 py-2 min-w-37 text-sm font-medium text-white bg-[#1a1a1a] rounded-md hover:bg-[#222222] disabled:bg-[#1a1a1a] disabled:cursor-not-allowed cursor-pointer border border-gray-600 hover:border-purple-500 flex items-center justify-between gap-2 peer"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading...
          </>
        ) : (
          <>Get Fortune 🔮</>
        )}
      </button>

      {fortune ? (
        <>
          <div className="h-[1px] w-8 bg-gray-600 peer-hover:bg-purple-500"></div>
          <div className="max-w-[300px] p-4 bg-[#1a1a1a] rounded-md shadow-lg text-sm border border-gray-600 peer-hover:border-purple-500">
            <p className="text-gray-200 font-medium whitespace-normal text-xs">🥠{' '}{fortune.replace(/🥠/g, '')}{' '}🥠</p>
          </div>
        </>
      ) : (
        <div className="w-[332px]" />
      )}
    </div>
  );
};
