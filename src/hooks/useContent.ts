'use client';

import { useState, useEffect } from 'react';

let cached: any = null;
let cachePromise: Promise<any> | null = null;

function fetchContent(): Promise<any> {
  if (cached) return Promise.resolve(cached);
  if (cachePromise) return cachePromise;
  cachePromise = fetch('/api/content')
    .then(r => r.json())
    .then(data => { cached = data; return data; });
  return cachePromise;
}

export function useContent<T>(selector: (data: any) => T): T | null {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    fetchContent().then(full => setData(selector(full)));
  }, []);

  return data;
}
