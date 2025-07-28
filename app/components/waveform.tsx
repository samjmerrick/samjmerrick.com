"use client";

import { useEffect, useRef } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import { PlayCircleIcon, PauseCircleIcon } from "@heroicons/react/24/solid";
import { useWaveformContext } from "app/components/waveformcontext";

export default function WaveformPlayer({ src }: { src: string }) {
  const containerRef = useRef(null);
  const { stopAll, registerStopCallback } = useWaveformContext();

  const { wavesurfer, isReady, isPlaying } = useWavesurfer({
    container: containerRef,
    url: src,
    waveColor: "grey",
    barWidth: 4,
    height: 100,
  });

  // Register how to stop this player
  useEffect(() => {
    if (!wavesurfer) return;
    const stop = () => wavesurfer.isPlaying() && wavesurfer.pause();
    registerStopCallback(stop);
  }, [wavesurfer, registerStopCallback]);

  // Play on waveform click
  useEffect(() => {
    if (!wavesurfer || !isReady) return;

    const handleClickToPlay = () => {
      if (!wavesurfer.isPlaying()) {
        stopAll();
        wavesurfer.play();
      }
    };

    wavesurfer.on("interaction", handleClickToPlay);
    return () => wavesurfer.un("interaction", handleClickToPlay);
  }, [wavesurfer, isReady, stopAll]);

  const onPlayPause = () => {
    if (!wavesurfer) return;
    if (!wavesurfer.isPlaying()) stopAll();
    wavesurfer.playPause();
  };

  return (
    <div className="flex flex-row">
      <button onClick={onPlayPause} className="w-14 mx-2 cursor-pointer">
        {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}
      </button>
      <div ref={containerRef} className="w-full cursor-pointer" />
    </div>
  );
}
