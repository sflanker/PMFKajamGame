import big from "./component-big";

// This initializes player related game objects
export default function initializePlayer(level) {
  // define some constants
  const JUMP_FORCE = 620;
  const MOVE_SPEED = 480;
  const FALL_DEATH = 2400;
  
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
    "bean",
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

  // inventory script
  // TODO: track quantities of multiple kinds of resource
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
  let hasWood = false; 
  player.collides("wood", (i) => {
    destroy(i);
    hasWood = true;
    add([
      sprite("inventory"),
      origin("topleft"),
      area(),
      fixed(),
    ]);
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

  keyPress("e", () => 
  {
    every("tree", (t) => 
    {
      if (player.isColliding(t)){
        if (t.is("tree") && !hasWood) 
        {
          const wood = level.spawn("#",  t.gridPos.sub(0, 1));
          wood.jump();
        }
      }
    })
  });

  /*
  add([
    sprite("inventory"),
    origin("topleft")     
  ]);
   */

  return player;
}