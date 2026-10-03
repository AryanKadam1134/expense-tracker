import { useCallback, useState } from "react";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "../types/api.types";

type UseApiOptions<T> = {
  loading?: boolean;
  onSuccess?: (response: ApiResponse<T>) => void;
  onError?: (error: unknown) => void;
};

const normalizeError = (error: unknown): Error => {
  if (error instanceof Error) return error;

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = error.message;
    if (typeof message === "string" && message.trim()) {
      return new Error(message, { cause: error });
    }
  }

  return new Error("Something went wrong!", { cause: error });
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
        onError?.(normalizeError(error));
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
