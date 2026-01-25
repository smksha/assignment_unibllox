import { useEffect, useState } from "react";

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useFetch<T>(url: string) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    setState({
      data: null,
      loading: true,
      error: null,
    });

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setState({
            data,
            loading: false,
            error: null,
          });
        }
      })
      .catch((err: Error) => {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: err.message || "Something went wrong",
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [url]);

  return state;
}
