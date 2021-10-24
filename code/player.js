import big from "./component-big";

// This initializes player related game objects
export default function initializePlayer(level) {
  // define some constants
  const JUMP_FORCE = 620;
  const MOVE_SPEED = 480;
  const FALL_DEATH = 2400;

  // define player object
  const player = add([
    sprite("bean", { width: 32, height: 32 }),
    pos(100, 20),
    area(),
    scale(1),
    // makes it fall to gravity and jumpable
    body(),
    // the custom component we defined above
    origin("bot"),
    "bean",
  ]);

  const digArea = add([
    area(100, 100),
    pos(225, 135),
    fixed(),
  ])

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

  let woodCount = 0;

  player.collides("wood", (w) => {
    destroy(w);
    add([
      sprite("wood"),
      origin("topleft"),
      area(),
      fixed(),
    ]);
    woodCount += 1;
    woodLabel.text = woodCount;
  });

  const woodLabel = add([
    text(""),
    pos(1, 0),
    scale(0.2),
    fixed(),
  ])

  // instead of using player.isColliding in an if block (which will only run once when the scene is created), use the player.collides event
  // the contents of your if block there { ... } should be the body of an arrow function that is the second argument to collides("tree", () => { ... }) 👍
  player.collides("searchable", () =>
  {
    //debug.log("show hint");
    const hint = add([
      text("E", { size: 48 }),
      pos(0, 0),
      fixed(),
    ]);
    
    const searchable = get("searchable")[0];
    // All event handler functions return another function that disables the event when it is called
    const stopAction = player.action(() => {
      // this is where you want an if () { ... } statement
      // checking if (!player.isColliding(tree) || hasWood)
      // isColliding might require an actual object instead of a tree, let me check... it works! could use an || there, depending on what behavior you want
      // odd, not sure why it's not working! so confused!
      // oh, actually maybe we do need the object. good now
      if ((!player.isColliding(searchable))){
        //debug.log(`destroy hint hasWood: ${hasWood}`);
        destroy(hint);
        // stop the action, since it will get recreated next time the player collides with the tree.
        stopAction();
      }
    })
    // add an player.action(() => { }) /* oops */ here and check if the player is no longer colliding with the tree, in which case, destroy(hint)
  })

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

  let axeEquiped = false;
  let pickaxeEquipped = false;
  let shovelEquiped = false;

  keyPress("1", () => {
    axeEquiped = true;
    pickaxeEquipped = false;
    shovelEquiped = false;
  });
  keyPress("2", () => {
    axeEquiped = false;
    pickaxeEquipped = true;
    shovelEquiped = false;
  });
  keyPress("3", () => {
    axeEquiped = false;
    pickaxeEquipped = false;
    shovelEquiped = true;
  });

  keyPress("e", () => 
  {
    every("searchable", (s) => 
    {
      if (player.isColliding(s)){
        if (s.is("searchable")) 
        {
          if("holdsWood" && axeEquiped)
          {
            const wood = level.spawn("#",s.gridPos.sub(0, 5));
            wood.jump();
            destroy(s);
          }
        }
      }
    })
  });

 clicks("breakable", (b) => 
 {
    destroy(b);
 })

 hovers("breakable", (h) => 
 {
   cursor("apple");
 })

  return player;
}
