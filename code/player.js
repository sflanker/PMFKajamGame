import big from "./component-big";
import onEvent from "./component-on-event";

// This initializes player related game objects
export default function initializePlayer(level, options) {
  // define some constants
  const JUMP_FORCE = 600;
  const MOVE_SPEED = 400;
  const FALL_DEATH = 2400;

  if (!options) {
    options = {};
  }
  if (!options.spawn) {
    options.spawn = vec2(100, 40);
  }
  if (!options.tileSize) {
    options.tileSize = 32;
  }

  // define player object
  const player = add([
    sprite("Player"),
    pos(options.spawn.x, options.spawn.y),
    area({ width: 11, height: 24, offset: vec2(7, 1) }),
    scale(2.6),
    // makes it fall to gravity and jumpable
    body(),
    // the custom component we defined above
    origin("bot"),
    layer("player"),
    onEvent("load", () => console.log("player loaded")),
    "player",
  ]);

  // The player will inexplicably fall through the ground on some systems.
  // This is a hack to prevent that
  player.weight = 0;
  setTimeout(() => { player.weight = 1; }, 500);

  // Debug code for the falling issue
  let yPos = player.pos.y;
  let stopReportingFall = player.action(() => {
    if (!player.grounded()) {
      let newY = player.pos.y;
      console.log(`falling: ${(newY - yPos) / dt()}`);
      yPos = newY;
    } else {
      stopReportingFall();
    }
  });

  const digArea = add ([
    area(100, 100),
    pos(225, 135),
    fixed(),
  ]);

  // action() runs every frame
  player.action(() => {
    // center camera to player
    camPos(vec2(player.pos.x, player.pos.y - 3 * options.tileSize));
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


  let resources = {};
  let resourceDisplay = {};
  let woodCount = 0;

  player.collides("resource", (w) => {
    let type = w.resourceType;
    destroy(w);
    woodCount += 1;

    if (resources[type]) {
      resources[type]++
    } else {
      resources[type] = 1;
      let offset = 48 + Object.getOwnPropertyNames(resourceDisplay).length * 32;

      let icon = add([
        sprite(type),
        pos(offset, 0),
        scale(2),
        layer("overlay"),
        origin("topleft"),
        area(),
        fixed(),
      ]);
      const label = add([
        text("", { size: 32 }),
        layer("overlay"),
        pos(offset + 48, 0),
        scale(1),
        fixed(),
      ]);

      resourceDisplay[type] = { icon, label };
    }

    resourceDisplay[type].label.text = resources[type];
  });


  // instead of using player.isColliding in an if block (which will only run once when the scene is created), use the player.collides event
  // the contents of your if block there { ... } should be the body of an arrow function that is the second argument to collides("tree", () => { ... }) ????
  player.collides("searchable", (s) => {
    //debug.log("show hint");
    let hintText = "Press E to interact.";

    if (s.compatibleTools &&
        !s.compatibleTools.includes(getEquippedTool())) {
      hintText = "Press a number key to\nselect the appropriate\ntool.";
    }

    const hint = add([
      text(hintText, { size: 48 }),
      layer("overlay"),
      pos(10, 10),
      fixed(),
      scale(1)
    ]);

    hint.scaleTo((width() * 0.4) / hint.width);

    // All event handler functions return another function that disables the event when it is called
    const stopAction = player.action(() => {
      // this is where you want an if () { ... } statement
      // checking if (!player.isColliding(tree) || hasWood)
      // isColliding might require an actual object instead of a tree, let me check... it works! could use an || there, depending on what behavior you want
      // odd, not sure why it's not working! so confused!
      // oh, actually maybe we do need the object. good now
      if ((!player.isColliding(s))) {
        //debug.log(`destroy hint hasWood: ${hasWood}`);
        destroy(hint);
        // stop the action, since it will get recreated next time the player collides with the tree.
        stopAction();
      } else if (s.compatibleTools &&
                 s.compatibleTools.includes(getEquippedTool())) {
          hint.text = hintText = "Press E to interact.";
          hint.scaleTo((width() * 0.4) / hint.width);
        } else {
          hint.text = hintText = "Press a number key to\nselect the appropriate\ntool.";
          hint.scaleTo((width() * 0.4) / hint.width);
        }
    })
    // add an player.action(() => { }) /* oops */ here and check if the player is no longer colliding with the tree, in which case, destroy(hint)
  })
  player.collides("NPC", (s) => {
    let hintText = "Press E to interact.";

    const hint = add([
      text(hintText, { size: 48 }),
      layer("overlay"),
      pos(10, 10),
      fixed(),
      scale(1)
    ]);

    hint.scaleTo((width() * 0.4) / hint.width)

    const stopAction = player.action(() => {
      if ((!player.isColliding(s))) {
        destroy(hint);
        stopAction();
      }
    })
  })

  // jump with space
  keyPress("space", () => {
    // these 2 functions are provided by body() component
    if (player.grounded()) {
      play("Jump(Purplemaia_Kajam_SFX)");
      player.jump(JUMP_FORCE);
      player.play('jump', { loop: true })
    }
  });

  let movement = "idle";

  function moveLeft() {
    if (movement !== "left") {
      if (player.grounded()) {
        movement = "left"
        player.play('walk', { loop: true });
      }

      player.flipX(true);
      player.area.offset = vec2(-7, 1);
    }
    player.move(-MOVE_SPEED, 0);
  };
  keyDown("left", moveLeft);
  keyDown("a", moveLeft);

  function moveRight() {
    if (movement !== "right") {
      if (player.grounded()) {
        movement = "right";
        player.play("walk", { loop: true });
      }

      player.flipX(false);
      player.area.offset = vec2(7, 1);
    }
    player.move(MOVE_SPEED, 0);
  }

  keyDown("right", moveRight);
  keyDown("d", moveRight);

  function idle() {
    movement = "idle";
    if (player.grounded()) {
      player.play("idle", { loop: true });
    }
  }

  keyRelease("left", idle);
  keyRelease("a", idle);
  keyRelease("right", idle);
  keyRelease("d", idle);

  keyPress("down", () => {
    player.weight = 3;
  });
  keyPress("s", () => {
    player.weight = 3;
  });

  keyRelease("down", () => {
    player.weight = 1;
  });
  keyRelease("s", () => {
    player.weight = 1;
  });

  player.on("ground", () => {
    if (movement === "idle") {
      player.play("idle", { loop: true });
    } else {
      player.play("walk", { loop: true });
    }
  })

  const YOffset = 48;
  let selection = add([
    outline(3),
    rect(64, 64),
    opacity(0.6),
    pos(width() / 2, YOffset),
    fixed(),
    origin("center"),
    layer("overlay")
  ]);
  selection.hidden = true;

  let axeIcon = add([
    sprite("Item-Hatchet"),
    scale(2),
    fixed(),
    pos(width() / 2 - 32, YOffset),
    origin("center"),
    layer("overlay")
  ]);

  let shovelIcon = add([
    sprite("Item-Stone_Shovel"),
    scale(2),
    fixed(),
    pos(width() / 2 + 32, YOffset),
    origin("center"),
    layer("overlay")
  ]);

  let axeEquipped = false;
  let pickaxeEquipped = false;
  let shovelEquipped = false;

  function getEquippedTool() {
    if (axeEquipped) {
      return "axe";
    } else if (shovelEquipped) {
      return "shovle";
    } else if (pickaxeEquipped) {
      return "pickaxe";
    }
  }

  function updateSelection() {
    if (axeEquipped) {
      selection.pos.x = width() / 2 - 32;
      selection.hidden = false;
    } else if (shovelEquipped) {
      selection.pos.x = width() / 2 + 32;
      selection.hidden = false;
    } else {
      selection.hidden = true;
    }
  }

  keyPress("1", () => {
    axeEquipped = true;
    pickaxeEquipped = false;
    shovelEquipped = false;
    updateSelection();
  });
  keyPress("3", () => {
    axeEquipped = false;
    pickaxeEquipped = true;
    shovelEquipped = false;
    updateSelection();
  });
  keyPress("2", () => {
    axeEquipped = false;
    pickaxeEquipped = false;
    shovelEquipped = true;
    updateSelection();
  });

  keyPress("e", () => {
    every("searchable", (s) => {
      if (player.isColliding(s)) {
        if (s.is("searchable")) {
          if (axeEquipped && s.compatibleTools && s.compatibleTools.includes("axe")) {
            // check resource type?
            const wood = level.spawn("w", s.gridPos.sub(0, 5));
            wood.jump();
            s.trigger("mined");
            destroy(s);
            play("Axe(Purplemaia_Kajam_SFX)");
          }
        }
      }
    })
    every("NPC", (n) => {
      if (player.isColliding(n)) {
        if (n.is("NPC")) {
          const quest = add([
            text("Travel across this HUGE land\nand deliver 7 wood to Pele", { size: 32 }),
            pos(20, height() * 0.25),
            fixed(),
            layer("overlay"),
            scale(1),
            lifespan(10, { fade: 1 })
          ]);
     
          quest.scaleTo((width() - 40) / quest.width);
        }
      }
    })
    every("Pele", (p) => {
      if (player.isColliding(p)) {
        if (p.is("Pele")) {
          if (woodCount >= 7) {
            go("win");
          } else {
            const warning = add([
              text("You have not collected enough wood!\nReturn when you have 7 wood.", { size: 32 }),
              pos(20, height() * 0.25),
              fixed(),
              layer("overlay"),
              scale(1),
              lifespan(10, { fade: 1 })
            ]);
      
            warning.scaleTo((width() - 40) / warning.width);
          }
        }
      }
    })
  });


  clicks("breakable", (b) => {
    if (shovelEquipped) {
      b.trigger("mined");
      destroy(b);
      play("Shoveling(Purplemaia_Kajam_SFX)", { volume: 0.5 });
    }
  })

  mouseMove((p) => {
    let isHovering = false;
    every("breakable", (b) => {
      // false && true -> false
      // true && true -> true
      // false || true -> true
      // false || false -> false
      // instance function on AreaComp:  isHovering() => boolean
      isHovering = isHovering || b.isHovering()
    })
    if (isHovering) {
      cursor("pointer");
    }
    else {
      cursor("default");
    }
  })

  return player;
}
