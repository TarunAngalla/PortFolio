import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Loading from "../components/Loading";
import { createLoadingProgress, type LoadingProgressApi } from "./loadingProgress";

const BOOTSTRAP_FAILSAFE_MS = 18_000;
const HARD_DISMISS_MS = 26_000;

interface LoadingType {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setLoading: (percent: number) => void;
  finishAssetLoading: () => Promise<number>;
}

export const LoadingContext = createContext<LoadingType | null>(null);

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(0);
  const progressApiRef = useRef<LoadingProgressApi | null>(null);

  useEffect(() => {
    const api = createLoadingProgress(setLoading);
    progressApiRef.current = api;
    api.start();

    const failSafe = window.setTimeout(() => {
      void api.finishTo100();
    }, BOOTSTRAP_FAILSAFE_MS);

    return () => {
      window.clearTimeout(failSafe);
      api.dispose();
      progressApiRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isLoading) return;
    const hardDismiss = window.setTimeout(() => {
      setIsLoading(false);
    }, HARD_DISMISS_MS);
    return () => window.clearTimeout(hardDismiss);
  }, [isLoading]);

  const finishAssetLoading = useCallback(() => {
    return progressApiRef.current?.finishTo100() ?? Promise.resolve(100);
  }, []);

  const value: LoadingType = {
    isLoading,
    setIsLoading,
    setLoading,
    finishAssetLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {isLoading && <Loading percent={loading} />}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
