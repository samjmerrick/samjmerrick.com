"use client";

import { useEffect, useRef } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import { PlayCircleIcon, PauseCircleIcon } from "@heroicons/react/24/solid";

export default function WaveformPlayer({ src }: { src: string }) {
  const containerRef = useRef(null);

  const { wavesurfer, isReady, isPlaying } = useWavesurfer({
    container: containerRef,
    url: src,
    waveColor: "grey",
    barWidth: 4,
    height: 100,
  });

  useEffect(() => {
    const handler = () => {
      if (wavesurfer && wavesurfer.isPlaying()) {
        wavesurfer.pause();
      }
    };

    window.addEventListener("wavesurfer-play", handler);
    return () => window.removeEventListener("wavesurfer-play", handler);
  }, [wavesurfer]);

  const onPlayPause = () => {
    if (!wavesurfer) return;

    if (!wavesurfer.isPlaying()) {
      // Notify all other players to stop
      window.dispatchEvent(new Event("wavesurfer-play"));
    }

    wavesurfer.playPause();
  };

  return (
    <div className="flex flex-row">
      <button onClick={onPlayPause} className="w-14 mx-2 cursor-pointer">
        {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}
      </button>
      <div ref={containerRef} className="w-full" />
    </div>
  );
}
