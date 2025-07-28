"use client";

import { useEffect, useRef } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import { PlayCircleIcon, PauseCircleIcon } from "@heroicons/react/24/solid";
import { useWaveformContext } from "app/components/waveformcontext";

export default function WaveformPlayer({
  src,
  title,
  description,
  idx,
}: {
  src: string;
  title: string;
  description: string;
  idx: number;
}) {
  const containerRef = useRef(null);
  const { stopAll, registerStopCallback } = useWaveformContext();

  const { wavesurfer, isReady, isPlaying } = useWavesurfer({
    container: containerRef,
    url: src,
    waveColor: "grey",
    barWidth: 4,
    height: 80,
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
    <div key={idx} className="my-16 flex flex-row content-center ">
      <img className="" />
      <div className="w-full">
        <div className="flex flex-row">
          <button onClick={onPlayPause} className="w-14 mr-2 cursor-pointer">
            {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}
          </button>
          <div>
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="text-gray-600 mb-2">{description}</p>
          </div>
        </div>
        <div ref={containerRef} className=" w-full cursor-pointer" />
      </div>
    </div>
  );
}
