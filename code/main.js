import kaboom from "kaboom";
import instance from "./kaboom-instance";
import loadAssets from "./assets";
import { trueType } from "./component-true-type"
import initializeLevelOne from "./level-one";
import initializeLaa from "./Laa";
import initializeLevelTest from "./level-test";
import initializeTeamThree from "./team-three";
import initializeAhSing from "./AhSingTestLevel"

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
initializeAhSing();

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
      "1. Level One\n2. Laa's Code\n3. Team Three\n4. Team Ah Sing\n5. Paul's Loader Test",
      { font: "Hanalei Fill", size: 64 }),
    pos(width() / 2, height() / 2 - 40),
    origin("center"),
    scale(1)
  ]);
  choice.scaleTo(Math.min((width() - 80) / choice.width, (height() - 180) / choice.height));
  let prompt = add([
    trueType(
      "Press a number key to select",
      { font: "Hanalei Fill", size: 32 }),
    pos(width() / 2, height() - 40),
    origin("bot"),
    scale(1),
  ]);
  prompt.scaleTo((width() - 80) / prompt.width);

  keyPress("1", () => {
    gameScene = "level-one";
    go("level-one")
  });

  keyPress("2", () => {
    gameScene = "laa";
    go("laa")
  });

  keyPress("3", () => {
    gameScene = "team-three";
    go("team-three")
  });

  keyPress("4", () => {
    gameScene = "AhSing";
    go("AhSing");
  });

  keyPress("5", () => {
    gameScene = "test";
    go("test");
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
