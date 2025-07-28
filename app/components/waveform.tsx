"use client";

import { useEffect, useRef } from "react";
import { useWavesurfer } from "@wavesurfer/react";

export default function WaveformPlayer({ src }: { src: string }) {
  const containerRef = useRef(null);

  const { wavesurfer, isReady, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    url: src,
    waveColor: "grey",
    barWidth: 4,
    height: 100,
  });

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  return (
    <>
      <div ref={containerRef} />

      <button onClick={onPlayPause}>{isPlaying ? "Pause" : "Play"}</button>
    </>
  );
}
