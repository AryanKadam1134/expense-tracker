import dayjs from "dayjs";

const formatDateInISO = (date: string) => {
  return date ? dayjs(date).format("YYYY-MM-DD") : "";
};

const formatDateInAlphaNumeric = (date: string) => {
  return date ? dayjs(date).format("DD MMM, YYYY") : "";
};

export { formatDateInISO, formatDateInAlphaNumeric };
