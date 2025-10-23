import { useState, useCallback } from 'react';

// A generic type for the function that will be passed to the hook
type GeminiApiFunction<T, P> = (params: P) => Promise<T>;

// The structure of the object returned by the hook
interface UseGeminiReturn<T, P> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  execute: (params: P) => Promise<void>;
}

export const useGemini = <T, P>(apiFunction: GeminiApiFunction<T, P>): UseGeminiReturn<T, P> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (params: P) => {
    setIsLoading(true);
    setError(null);
    // Optionally reset data on new execution
    setData(null); 
    try {
      const result = await apiFunction(params);
      setData(result);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred while calling the Gemini API.');
    } finally {
      setIsLoading(false);
    }
  }, [apiFunction]);

  return { data, isLoading, error, execute };
};
