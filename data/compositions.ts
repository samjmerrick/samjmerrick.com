const compositions = [
  {
    title: "Echoes of the forgotten",
    description:
      "Soft melodies set a melancholic mood through a rain-soaked city",
    file: "/audio/echoes_of_the_forgotten.mp3",
    tags: ["atmospheric", "piano"],
  },
];

export default compositions;

export type Composition = (typeof compositions)[number];
