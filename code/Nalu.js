import patrol from "./patrol";
import big from "./big";
import loadAssets from "./assets";

export default function runNalu() {
  loadAssets();

  // define some constants
  const JUMP_FORCE = 1320;
  const MOVE_SPEED = 480;
  const FALL_DEATH = 2400;

  const LEVELS = [
    [
      "                          $",
      "                          $",
      "                          $",
      "                          $",
      "                          $",
      "                      =   $",
      "         ====         =   $",
      "     %                =   $",
      "                      =    ",
      "     ^         = >    =   @",
      "===========================",
    ],
  ];

  /*
  let inventory = {};
  
  collides("resource", obj => {
    if (inventory[obj.resourceType]) {
      inventory[obj.resourceType] = [obj.resourceType] + 1;
    } else {
      inventory[obj.resourceType] = 1;
    }
  });
  
  add([
    sprite("whatever"),
    { resourceType: "wood" },
    "resource"
  ]) */

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

  scene("game", ({ levelId, coins } = { levelId: 0, coins: 0 }) => {

    gravity(3200);

    // add level to scene
    const level = addLevel(LEVELS[levelId ?? 0], levelConf);

    // define player object
    const player = add([
      sprite("bean"),
      pos(0, 0),
      area(),
      scale(1),
      // makes it fall to gravity and jumpable
      body(),
      // the custom component we defined above
      big(),
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

    // if player collides with any obj with "danger" tag, lose
    player.collides("danger", () => {
      go("lose");
    });

    player.collides("portal", () => {
      if (hasWood) {
        if (levelId + 1 < LEVELS.length) {
          go("game", {
            levelId: levelId + 1,
            coins: coins,
          });
        } else {
          go("win");
        }
      }
    });

    player.on("ground", (l) => {
      if (l.is("enemy")) {
        player.jump(JUMP_FORCE * 1.5);
        destroy(l);
        addKaboom(player.pos);
      }
    });

    player.collides("enemy", (e, side) => {
      if (side !== "bottom") {
        go("lose");
      }
    });

    let hasWood = false;

    player.collides("wood", (a) => {
      destroy(a);
      hasWood = true;
    });

    player.collides("wood", (w) => {
      destroy(w);
      coins += 1;
      coinsLabel.text = coins;
      hasWood = true
    });

    const coinsLabel = add([
      text(coins),
      pos(24, 24),
      fixed(),
    ]);

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

    keyPress("f", () => {
      fullscreen(!fullscreen());
    });

    keyPress("e", () => {
      every("tree", (t) => {
        if (player.isColliding(t)){
          player.collides("tree", (t) => {
            if (t.is("tree") && !hasWood) {
            const wood = level.spawn("#",  t.gridPos.sub(3, 1));
            wood.jump();
            hasWood = true;
        }
      });
        }
      })
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