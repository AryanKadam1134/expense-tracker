import { useCallback } from "react";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

import { normalizeFieldErrors } from "../utils/normalizeFieldErrors";

export default function useFieldErrors<TFieldValues extends FieldValues>(
  setError: UseFormSetError<TFieldValues>,
) {
  const addErrors = useCallback(
    (error: unknown) => {
      const fieldErrors = normalizeFieldErrors(error);

      fieldErrors.forEach(([field, message]) => {
        setError(field as Path<TFieldValues>, { type: "server", message });
      });
    },
    [setError],
  );

  return { addErrors };
}
