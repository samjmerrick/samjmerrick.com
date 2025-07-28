"use client";

import { createContext, useContext, useRef, ReactNode } from "react";

type WaveformContextType = {
  stopAll: () => void;
  registerStopCallback: (cb: () => void) => void;
};

const WaveformContext = createContext<WaveformContextType | null>(null);

export const WaveformProvider = ({ children }: { children: ReactNode }) => {
  const stopCallbacksRef = useRef<Set<() => void>>(new Set());

  const registerStopCallback = (cb: () => void) => {
    stopCallbacksRef.current.add(cb);
  };

  const stopAll = () => {
    stopCallbacksRef.current.forEach((cb) => cb());
  };

  return (
    <WaveformContext.Provider value={{ stopAll, registerStopCallback }}>
      {children}
    </WaveformContext.Provider>
  );
};

export const useWaveformContext = () => {
  const ctx = useContext(WaveformContext);
  if (!ctx)
    throw new Error("useWaveformContext must be used inside WaveformProvider");
  return ctx;
};
