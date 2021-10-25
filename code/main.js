import kaboom from "kaboom";
import instance from "./kaboom-instance";
import loadAssets from "./assets";
import { trueType } from "./component-true-type"
import initializeLevelOne from "./level-one";

/******************************************************************************
 * 
 * Backlog
 * =======
 * 
 * Done(Mitchell & Paul): loading screen
 *
 * Player behavior
 *   DONE(Nalu): Player Movement
 *   Done(Nalu): Resource gathering
 *   Done(Nalu): Inventory (track resources, display)
 *   Done(Nalu): Terrain interactions (dig)
 *   TODO: Mob interactions (mele attacks, weapons?, jump attack)
 *   TODO: Track/display health
 *   TODO: Crafting/Trading (convert resources into items. overlay screen? what items?
 *         needs specification)
 *   Done(Nau): Items (equip item? display item being held? use item?)
 *   Done(Laa): Sound Effects
 *
 * Generic level functionality
 *   Done(Paul): Level map loader *** HAS BUGS
 *   Done(Nalu): Camera behavior
 *   Done(Paul): Background effects *** HAS BUGS!
 *   Done(Paul/Nalu): Foreground object capabilities (add sprite, specifiy size, location,
 *         define interaction behavior)
 *   TODO: Mobs: spawning, movement, response to player, deal damage to player
 *
 * Level transition
 *   TODO: figure out what even happens here? Is it a different kind of
 *         gameplay? boss fight? or just a cinematic?
 *
 * Level one design:
 *   Done(Kaʻena?): terrain & platform layout
 *   Done: define forground objects
 *   Done(Jacob & Nalu): Level one win condition NPC
 *   TODO: hidden resource locations
 * 
 *****************************************************************************/

/******************************************************************************
 * 
 * Game Code
 * 
 *****************************************************************************/

loadAssets();
initializeLevelOne();

scene("intro", () => {
  const music = play("Soothing_and_Fading(IGT)", {
    volume: 0.5,
    loop: true
  });

  let sceneCleanup = add([
    "scene-cleanup"
  ]);

  sceneCleanup.on("destroy", () => {
    music.stop();
  });

  let coverSize = Math.min(width() - 40, height() - 40);
  add([
    rect(coverSize, coverSize),
    color(150, 150, 150),
    outline(4, rgb(0, 0, 0)),
    origin("center"),
    pos(width() / 2, height() / 2),
  ])

  let coverImage = add([
    sprite("To-The-Top"),
    pos(width() / 2, height() / 2),
    origin("center"),
    scale(1)
  ]);

  coverImage.scaleTo((coverSize) / coverImage.height);

  let prompt = add([
    trueType(
      "Press [Space] To Start.",
      { font: "Hanalei Fill", size: 32 }),
    pos(width() / 2, height() - 20),
    origin("bot"),
    scale(1),
  ]);
  prompt.scaleTo((coverSize - 20) / prompt.width);

  keyPress("space", () => {
    gameScene = "level-one";
    go("level-one")
  });
});

let gameScene = "intro";

scene("lose", () => {
  add([
    text("Gameover"),
  ]);
  keyPress(() => go(gameScene));
});

scene("win", () => {
  add([
    text("Victory"),
  ]);
  keyPress(() => go(gameScene));
});

go("intro");
