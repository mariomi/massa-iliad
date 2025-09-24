'use client';

import { useEffect, useState } from 'react';
import { demoDataService } from './demo-service';

export function useDemoData() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Force re-initialization on client side
    setIsInitialized(true);
  }, []);

  return {
    isInitialized,
    demoDataService: isInitialized ? demoDataService : null
  };
}
