const compositions = [
  {
    title: "Autumn Rain",
    description: "A piano piece inspired by seasonal transitions.",
    file: "/audio/track.wav",
    tags: ["melodic", "atmospheric"],
  },
  {
    title: "Evening Glow",
    description: "Ambient electronic piece using analog synths.",
    file: "/audio/track.wav",
    tags: ["uplifting", "soundtrack"],
  },
];

export default compositions;

export type Composition = (typeof compositions)[number];
