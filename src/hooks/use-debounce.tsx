import { useRef } from "react";

export default function useDebounce() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (callback: () => void, delay = 500) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(callback, delay);
  };
}
