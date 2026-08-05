import { useEffect, useMemo, useRef } from "react";
import { debounce } from "~/lib/utils/helpers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(
    () =>
      // eslint-disable-next-line react-hooks/refs
      debounce((...args: Parameters<T>) => {
        callbackRef.current(...args);
      }, delay),
    [delay]
  );

  return debouncedCallback;
}
