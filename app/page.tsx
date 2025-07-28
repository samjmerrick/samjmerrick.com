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
        <WaveformPlayer track={track} idx={idx} />
      ))}
      <p className="text-gray-400 text-center py-10">
        Like what you hear?{" "}
        <a
          href="/contact"
          className="text-blue-400 hover:text-blue-600 transition-colors"
        >
          Let's chat
        </a>
      </p>
    </div>
  );
}
