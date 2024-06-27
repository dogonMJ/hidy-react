import { useEffect, useState } from "react";

interface FetchData {
  data: any
  loading: boolean
}
type FetchType = 'json' | 'text'

export const useFetchData = (input: RequestInfo | URL, init?: RequestInit | undefined, type: FetchType = 'json'): FetchData => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(input, init);
        if (response.status === 200) {
          const result = type === 'text' ? await response.text() : await response.json();
          setData(result);
        }
      } catch (error) {
        console.error('API request failed', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData()

  }, [input])

  return { data, loading };
}