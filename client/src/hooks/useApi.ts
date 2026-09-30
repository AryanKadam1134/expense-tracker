import { useCallback, useState } from "react";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../services/api.service";

type UseApiOptions<T> = {
  loading?: boolean;
  onSuccess?: (response: ApiResponse<T>) => void;
  onError?: (error: unknown) => void;
};

const useApi = <TLoading extends Record<string, boolean>>(
  defaults: TLoading,
) => {
  const [loading, setLoading] = useState<TLoading>(defaults);

  const setLoadingKey = useCallback((key: keyof TLoading, value: boolean) => {
    setLoading((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const callApi = useCallback(
    async <T>(
      keyName: keyof TLoading,
      api: () => Promise<AxiosResponse<ApiResponse<T>>>,
      { loading: shouldLoad = true, onSuccess, onError }: UseApiOptions<T> = {},
    ): Promise<ApiResponse<T> | undefined> => {
      if (shouldLoad) {
        setLoadingKey(keyName, true);
      }

      try {
        const response = await api();
        const res = response.data;

        onSuccess?.(res);
        return res;
      } catch (error: unknown) {
        console.error("Error: ", error);
        onError?.(error);
        return undefined;
      } finally {
        setLoadingKey(keyName, false);
      }
    },
    [setLoadingKey],
  );

  return { loading, callApi };
};

export default useApi;
