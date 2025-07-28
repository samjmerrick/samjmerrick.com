import compositions from "@data/compositions";
import WaveformPlayer from "app/components/waveform";

export default function Home() {
  return (
    <div className="px-4">
      <div className="flex flex-row items-center mb-8">
        <img src="images/me.jpg" className="w-24 rounded-full mr-4" />
        <div>
          <h1 className="text-4xl font-bold">Sam Merrick</h1>
          <p className="text-gray-600">
            Music Composer for Film, TV, and Video Games
          </p>
        </div>
      </div>
      {compositions.map((track, idx) => (
        <div key={idx} className="mb-10">
          <h2 className="text-2xl font-semibold">{track.title}</h2>
          <p className="text-gray-600 mb-2">{track.description}</p>
          <WaveformPlayer src={track.file} />
        </div>
      ))}
    </div>
  );
}
