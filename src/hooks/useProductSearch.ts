import { useEffect, useState } from "react";

type SearchState = { query: string; categoria: string };

let state: SearchState = { query: "", categoria: "" };
const listeners = new Set<(s: SearchState) => void>();

export const setProductSearch = (patch: Partial<SearchState>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l(state));
};

export const useProductSearch = (): SearchState => {
  const [s, setS] = useState<SearchState>(state);
  useEffect(() => {
    listeners.add(setS);
    return () => {
      listeners.delete(setS);
    };
  }, []);
  return s;
};
