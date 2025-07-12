'use client';

import { useState, useEffect } from 'react';
import { AIModel } from '@/types';

export function useAIModels() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [currentModel, setCurrentModel] = useState<AIModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/documents');
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch AI models');
      }

      setModels(data.models);
      setCurrentModel(data.currentModel);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch AI models';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return {
    models,
    currentModel,
    isLoading,
    error,
    refetch: fetchModels,
  };
}
