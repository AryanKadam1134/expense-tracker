export const getUpdatedFields = <T extends object>(
  data: T,
  dirtyFields: object,
): Partial<T> => {
  const updated: Partial<T> = {};
  const values = data as Record<string, unknown>;
  const dirty = dirtyFields as Record<string, unknown>;

  for (const key of Object.keys(dirty)) {
    const dirtyValue = dirty[key];

    if (dirtyValue === true) {
      Object.assign(updated, { [key]: values[key] });
      continue;
    }

    if (
      typeof dirtyValue === "object" &&
      dirtyValue !== null &&
      !Array.isArray(dirtyValue) &&
      typeof values[key] === "object" &&
      values[key] !== null
    ) {
      const nested = getUpdatedFields(
        values[key] as Record<string, unknown>,
        dirtyValue,
      );
      if (Object.keys(nested).length > 0) {
        Object.assign(updated, { [key]: nested });
      }
    }
  }

  return updated;
};
