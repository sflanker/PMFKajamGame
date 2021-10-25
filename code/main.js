import kaboom from "kaboom";
import instance from "./kaboom-instance";
import loadAssets from "./assets";
import { trueType } from "./component-true-type"
import initializeLevelOne from "./level-one";
import initializeNalu from "./Test-Nalu";
import initializeLaa from "./Test-Laa";
import initializeTeamThree from "./Test-team-three";
import initializeAhSing from "./Test-AhSingTestLevel"

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
 *   Done(Nalu): Inventory (track resources, display)
 *   IN PROGRESS(Nalu): Terrain interactions (dig)
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
initializeNalu();
initializeLaa();
initializeTeamThree();
initializeAhSing();

scene("intro", () => {
  debug.log('play music')
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

  /*
  let choice = add([
    trueType(
      "1. Level One\n2. Nalu's Code\n3. Laa's Code\n4. Team Three\n5. Team Ah Sing",
      { font: "Hanalei Fill", size: 64 }),
    pos(width() / 2, height() / 2 - 40),
    origin("center"),
    scale(1)
  ]);
  choice.scaleTo(Math.min((width() - 80) / choice.width, (height() - 180) / choice.height));
  */
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

  keyPress("2", () => {
    gameScene = "nalu";
    go("nalu")
  });

  keyPress("3", () => {
    gameScene = "laa";
    go("laa")
  });

  keyPress("4", () => {
    gameScene = "team-three";
    go("team-three")
  });

  keyPress("5", () => {
    gameScene = "AhSing";
    go("AhSing");
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
