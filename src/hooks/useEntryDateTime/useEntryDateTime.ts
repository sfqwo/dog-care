import { useMemo, useState } from "react";
import {
  formatCurrentDateInput,
  formatDateInputFromTimestamp,
  formatTimeInput,
  formatTimeInputFromTimestamp,
  parseDateTimeInput,
} from "@dog-care/core/utils";

export function useEntryDateTime() {
  const [date, setDate] = useState(formatCurrentDateInput);
  const [time, setTimeValue] = useState(() => formatTimeInputFromTimestamp(Date.now()));
  const timestamp = useMemo(() => parseDateTimeInput(date, time), [date, time]);

  const setTime = (value: string) => setTimeValue(formatTimeInput(value));

  const setTimestamp = (value: number) => {
    setDate(formatDateInputFromTimestamp(value));
    setTimeValue(formatTimeInputFromTimestamp(value));
  };

  const resetToNow = () => setTimestamp(Date.now());

  return {
    date,
    setDate,
    time,
    setTime,
    timestamp,
    setTimestamp,
    resetToNow,
  };
}
