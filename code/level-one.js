import patrol from "./component-patrol";
import initializePlayer from "./player";

export default function initializeLevelOne() {

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
  const levelConf = {
    // grid size
    width: 32,
    height: 32,
    // define each object as a list of components
    "=": () => [
      sprite("UnbreakableSand"),
      area(),
      solid(),
      origin("bot"),
    ],
    "b": () => [
      sprite("breakableSand"),
      area(),
      solid(),
      origin("bot"),
      "breakable",
    ],
    "^": () => [
      sprite("tree", { width: 32, height: 32 }),
      scale(10),
      area({ scale: 0.2 }),
      origin("bot"),
      "searchable",
      "holdsWood",
    ],
    "#": () => [
      sprite("wood", { width: 32, height: 32 }),
      area(),
      scale(2),
      origin("bot"),
      body(),
      "wood",
    ],
    "-": () => [
      sprite("inventory", { width: 32, height: 32 }),
      scale(2),
      origin("botleft"),
      "inventory",
    ],
    ">": () => [
      sprite("googoly", { width: 32, height: 32 }),
      area(),
      origin("bot"),
      body(),
      patrol(),
      "enemy",
    ],
    "@": () => [
      sprite("portal", { width: 32, height: 32 }),
      area({ scale: 0.5, }),
      origin("bot"),
      pos(0, -12),
      "portal",
    ],
  };

  scene("level-one", () => {
    gravity(3200);

    // add level to scene
    const level = addLevel(LEVEL, levelConf);

    const player = initializePlayer(level);

    player.collides("portal", () => {
        go("win");
    });
  });
}