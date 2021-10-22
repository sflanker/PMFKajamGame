import loadAssets from "./assets";

export default function runLaa() {
  loadAssets();

  // define some constants
  const JUMP_FORCE = 1320;
  const MOVE_SPEED = 480;
  const FALL_DEATH = 2400;

  const LEVEL = [
      "                          $",
      "                          $",
      "                          $",
      "                          $",
      "                          $",
      "                      =   $",
      "         ====         =   $",
      "                      =   $",
      "                      =   $",
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
    "A": () => [
      sprite("?"),
      area(),
      solid(),
      pos(0, 0),
      origin("bot"),
    ],
    "$": () => [
      sprite("coin"),
      area(),
      pos(0, -9),
      origin("bot"),
      "coin",
    ],
    "%": () => [
      sprite("box"),
      area(),
      solid(),
      origin("bot"),
      "box",
    ],
    "^": () => [
      sprite("tree"),
      scale(10),
      area(),
      pos(0, -50),
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
    ">": () => [
      sprite("googoly"),
      area(),
      origin("bot"),
      body(),
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

  scene("game", () => {
    gravity(3200);

    // add level to scene
    const level = addLevel(LEVEL, levelConf);

    // define player object
    const player = add([
      sprite("bean"),
      pos(0, 0),
      area(),
      scale(1),
      // makes it fall to gravity and jumpable
      body(),
      // the custom component we defined above
      origin("bot"),
    ]);

    // action() runs every frame
    player.action(() => {
      // center camera to player
      camPos(player.pos);
      // check fall death
      if (player.pos.y >= FALL_DEATH) {
        go("lose");
      }
    });

    player.on("ground", (l) => {
      if (l.is("enemy")) {
        player.jump(JUMP_FORCE * 1.5);
        destroy(l);
        addKaboom(player.pos);
      }
    });

    // jump with space
    keyPress("space", () => {
      // these 2 functions are provided by body() component
      if (player.grounded()) {
        player.jump(JUMP_FORCE);
      }
    });

    keyDown("left", () => {
      player.move(-MOVE_SPEED, 0);
    });

    keyDown("right", () => {
      player.move(MOVE_SPEED, 0);
    });

    keyPress("down", () => {
      player.weight = 3;
    });

    keyRelease("down", () => {
      player.weight = 1;
    });



  });

  scene("lose", () => {
    add([
      text("You Lose"),
    ]);
    keyPress(() => go("game"));
  });

  scene("win", () => {
    add([
      text("You Win"),
    ]);
    keyPress(() => go("game"));
  });

  go("game");
}