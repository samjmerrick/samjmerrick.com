"use client";

import { useEffect, useRef, useState } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import { PlayCircleIcon, PauseCircleIcon } from "@heroicons/react/24/solid";
import { useWaveformContext } from "app/components/waveformcontext";
import { Composition } from "@data/compositions";

export default function WaveformPlayer({
  track,
  idx,
}: {
  track: Composition;
  idx: number;
}) {
  const containerRef = useRef(null);
  const { stopAll, registerStopCallback } = useWaveformContext();

  // Explicit type: array of arrays of numbers (for stereo/multichannel peaks)
  const [peaks, setPeaks] = useState<(number[] | Float32Array)[] | undefined>(
    () => {
      try {
        const cached = localStorage.getItem("peaks_" + track.file);
        return cached
          ? (JSON.parse(cached) as (number[] | Float32Array)[])
          : undefined;
      } catch {
        return undefined;
      }
    }
  );

  const { wavesurfer, isReady, isPlaying } = useWavesurfer({
    container: containerRef,
    url: track.file,
    peaks,
    waveColor: "grey",
    barWidth: 4,
    height: 80,
  });

  // Register stop logic for play exclusivity
  useEffect(() => {
    if (!wavesurfer) return;
    const stop = () => wavesurfer.isPlaying() && wavesurfer.pause();
    registerStopCallback(stop);
  }, [wavesurfer, registerStopCallback]);

  // Click waveform to play
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

  // Cache peaks after rendering
  useEffect(() => {
    if (!wavesurfer || !isReady || peaks) return;

    const exported = wavesurfer.exportPeaks() as (number[] | Float32Array)[];
    try {
      localStorage.setItem("peaks_" + track.file, JSON.stringify(exported));
      setPeaks(exported);
      console.log("Cached peaks for", track.file);
    } catch (err) {
      console.warn("Error caching peaks:", err);
    }
  }, [wavesurfer, isReady, track.file, peaks]);

  const onPlayPause = () => {
    if (!wavesurfer) return;
    if (!wavesurfer.isPlaying()) stopAll();
    wavesurfer.playPause();
  };

  return (
    <div key={idx} className="my-16 flex flex-row content-center">
      <img className="" />
      <div className="w-full">
        <div className="flex flex-row items-center">
          <button onClick={onPlayPause} className="w-14 mr-2 cursor-pointer">
            {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}
          </button>
          <div className="w-full">
            <h2 className="text-2xl font-semibold">{track.title}</h2>
            <p className="text-gray-600 mb-2">{track.description}</p>
          </div>

          <div className="hidden md:flex flex-row">
            {track.tags.map((tag) => (
              <p
                key={tag}
                className="mr-2 bg-neutral-800 rounded-md px-2 py-1 capitalize text-sm"
              >
                {tag}
              </p>
            ))}
          </div>
        </div>
        <div ref={containerRef} className="w-full cursor-pointer" />
      </div>
    </div>
  );
}
