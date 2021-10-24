import kaboom from "kaboom";
import instance from "./kaboom-instance";
import loadAssets from "./assets";
import { trueType } from "./component-true-type"
import initializeLevelOne from "./level-one";
import initializeLaa from "./Laa";
import initializeLevelTest from "./level-test";
import initializeTeamThree from "./team-three";

/******************************************************************************
 * 
 * Backlog
 * =======
 * 
 * TODO: loading screen
 *
 * Player behavior
 *   DONE(Nalu): Player Movement
 *   IN PROGRESS(Nalu): Resource gathering
 *   TODO(Nalu): Inventory (track resources, display)
 *   TODO: Terrain interactions (dig)
 *   TODO: Mob interactions (mele attacks, weapons?, jump attack)
 *   TODO: Track/display health
 *   TODO: Crafting/Trading (convert resources into items. overlay screen? what items?
 *         needs specification)
 *   TODO: Items (equip item? display item being held? use item?)
 *
 * Generic level functionality
 *   TODO(Paul): Level map loader
 *   TODO: Camera behavior (follow player?)
 *   TODO: Background effects (parallax?)
 *   TODO: Foreground object capabilities (add sprite, specifiy size, location,
 *         define interaction behavior)
 *   TODO: Mobs: spawning, movement, response to player, deal damage to player
 *
 * Level transition
 *   TODO: figure out what even happens here? Is it a different kind of
 *         gameplay? boss fight? or just a cinematic?
 *
 * Level one design:
 *   TODO(Kaʻena?): terrain & platform layout
 *   TODO: hidden resource locations
 *   TODO: define forground objects
 * 
 *****************************************************************************/

/******************************************************************************
 * 
 * Game Code
 * 
 *****************************************************************************/

loadAssets();

initializeLevelOne();
initializeLaa();
initializeLevelTest();
initializeTeamThree();

scene("intro", () => {
  add([
    rect(width() - 40, height() - 40),
    color(150, 150, 150),
    outline(4, rgb(0, 0, 0)),
    origin("center"),
    pos(width() / 2, height() / 2),
  ])
  let choice = add([
    trueType(
      "Level One ->",
      { font: "Hanalei Fill", size: 32 }
    ),
    pos(width() / 2, height() / 2 - 40),
    origin("center"),
    scale(1)
  ]);
  choice.scaleTo((width() - 60) / choice.width);
  let prompt = add([
    text("Press an arrow key to select"),
    pos(width() / 2, height() / 2 + 40),
    origin("center"),
    scale(1),
  ]);
  prompt.scaleTo((width() - 60) / prompt.width);

  keyPress("left", () => {
    gameScene = "laa";
    go("laa")
  });

  keyPress("right", () => {
    gameScene = "level-one";
    go("level-one")
  });
});

let gameScene;

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
