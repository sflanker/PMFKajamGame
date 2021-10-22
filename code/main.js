import kaboom from "kaboom";
import { example } from "./team-one"
import runNalu from "./Nalu"
import loadAssets from "./assets";
import loadLevel from "./level-loader";

// initialize context
kaboom();

// TODO: loading screen

// Player behavior
//   DONE(Nalu): Player Movement
//   IN PROGRESS(Nalu): Resource gathering
//   TODO(Nalu): Inventory (track resources, display)
//   TODO: Terrain interactions (dig)
//   TODO: Mob interactions (mele attacks, weapons?, jump attack)
//   TODO: Track/display health
//   TODO: Crafting/Trading (convert resources into items. overlay screen? what items?
//         needs specification)
//   TODO: Items (equip item? display item being held? use item?)

// Generic level functionality
//   TODO(Paul): Level map loader
//   TODO: Camera behavior (follow player?)
//   TODO: Background effects (parallax?)
//   TODO: Foreground object capabilities (add sprite, specifiy size, location,
//         define interaction behavior)
//   TODO: Mobs: spawning, movement, response to player, deal damage to player

// Level transition
//   TODO: figure out what even happens here? Is it a different kind of
//         gameplay? boss fight? or just a cinematic?

// Level one design:
//   TODO(Kaʻena?): terrain & platform layout
//   TODO: hidden resource locations
//   TODO: define forground objects

// team one code
// example();

// Nalu's code
runNalu();