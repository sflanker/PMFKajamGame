import patrol from "./component-patrol";
import initializePlayer from "./old-player";

export default function initializeNalu() {

  const LEVEL = [
      "=======================    ",
      "                      b    ",
      "                      b    ",
      "                      b    ",
      "                      b    ",
      "                      b    ",
      "            ===       b    ",
      "                      b    ",
      "                      b    ",
      "     ^    ^    = >    b   @",
      "===========================",
  ];

  // define what each symbol means in the level graph
  const levelConf = 
  {
    // grid size
    width: 32,
    height: 32,
    // define each object as a list of components
    "=": () => 
    [
      sprite("Tile-Sand-Unbreakable"),
      area(),
      solid(),
      origin("bot"),
    ],
    "b": () => 
    [
      sprite("Tile-Sand"),
      area(),
      solid(),
      origin("bot"),
      "breakable",
    ],
    "^": () => 
    [
      sprite("tree", { width: 32, height: 32 }),
      scale(10),
      area({ scale: 0.2 }),
      origin("bot"),
      "searchable",
      "holdsWood",
    ],
    "#": () => 
    [
      sprite("wood", { width: 32, height: 32 }),
      area(),
      scale(2),
      origin("bot"),
      body(),
      "wood",
    ],
    "-": () => 
    [
      sprite("wood", { width: 32, height: 32 }),
      scale(2),
      origin("botleft"),
      "inventory",
    ],
    ">": () => 
    [
      sprite("googoly", { width: 32, height: 32 }),
      area(),
      origin("bot"),
      body(),
      patrol(),
      "enemy",
    ],
    "@": () => 
    [
      sprite("portal", { width: 32, height: 32 }),
      area({ scale: 0.5, }),
      origin("bot"),
      pos(0, -12),
      "portal",
    ],
  };

  scene("nalu", () => 
  {
    gravity(3200);

    // add level to scene
    const level = addLevel(LEVEL, levelConf);

    const player = initializePlayer(level);

    player.collides("portal", () => 
    {
      go("win");
    });
  });
}