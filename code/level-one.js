import patrol from "./component-patrol";
import initializePlayer from "./player"

export default function initializeLevelOne() {

  const LEVEL = [
      "                          $",
      "                          $",
      "                          $",
      "                          $",
      "                          $",
      "                      =   $",
      "         ====         =   $",
      "                      =   $",
      "                      =    ",
      "     ^         = >    =   @",
      "===========================",
    ];


  // define what each symbol means in the level graph
  const levelConf = {
    // grid size
    width: 64,
    height: 64,
    // define each object as a list of components
    "=": () => [
      sprite("grass"),
      area(),
      solid(),
      origin("bot"),
    ],
    "$": () => [
      sprite("coin"),
      area(),
      pos(0, -9),
      origin("bot"),
      "coin",
    ],
    "^": () => [
      sprite("tree"),
      scale(10),
      area({ scale: 0.2 }),
      origin("bot"),
      "tree",
    ],
    "#": () => [
      sprite("wood"),
      area(),
      scale(2),
      origin("bot"),
      body(),
      "wood",
    ],
    "-": () => [
      sprite("inventory"),
      scale(2),
      origin("botleft"),
      "inventory",
    ],
    ">": () => [
      sprite("googoly"),
      area(),
      origin("bot"),
      body(),
      patrol(),
      "enemy",
    ],
    "@": () => [
      sprite("portal"),
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
      if (hasWood) {
        // TODO: Handle advancement to next level
        go("win");
      }
    });
  });
}