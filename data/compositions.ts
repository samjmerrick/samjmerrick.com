const compositions = [
  {
    title: "Into the Aether",
    description: "Slowly evolving into a hybrid orchestral score",
    file: "/audio/into_the_aether.mp3",
    tags: ["cinematic", "hybrid"],
  },
  {
    title: "Echoes of the Forgotten",
    description:
      "Soft melodies set a melancholic mood through a rain-soaked city",
    file: "/audio/echoes_of_the_forgotten.mp3",
    tags: ["atmospheric", "piano"],
  },
];

export default compositions;

export type Composition = (typeof compositions)[number];
