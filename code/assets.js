// import { loadTrueType } from "./component-true-type"

export default function loadAssets() {
  loadSprite("bean", "sprites/bean.png");
  loadSprite("googoly", "sprites/googoly.png");
  loadSprite("grass", "sprites/grass.png");
  loadSprite("portal", "sprites/portal.png");
  loadSprite("coin", "sprites/coin.png");
  loadSprite("tree", "sprites/Tree.png");
  loadSprite("wood", "sprites/wood.png");
  loadSprite("stone", "sprites/Stone-1.png.png");
  loadSprite("seashell", "sprites/seashell.png");

  // Welcome Page
  loadSprite("To-The-Top", "sprites/To-The-Top.png");

  // Tiles
  loadSprite("Tile-Bedrock", "sprites/Tile-Bedrock.png");
  loadSprite("Tile-Dirt", "sprites/Tile-Dirt.png");
  loadSprite("Tile-Planks", "sprites/Tile-Planks.png");
  loadSprite("Tile-Sand-Unbreakable", "sprites/Tile-Sand-Unbreakable.png");
  loadSprite("Tile-Sand", "sprites/Tile-Sand.png");
  loadSprite("Tile-Thatch", "sprites/Tile-Thatch.png");
  loadSprite("Tile-Water", "sprites/Tile-Water.png");
  loadSprite("Tile-Rock", "sprites/Tile-Rock.png");
  loadSprite("Tile-Cave", "sprites/Tile-Cave.png");
  loadSprite("Tile-Lava", "sprites/Tile-Lava.png");
  loadSprite("Tile-Dug-Sand", "sprites/Tile-Dug-Sand.png");


  // Backgrounds
  loadSprite("Beach-Background", "sprites/Beach-Background.png");

  // Scenery
  loadSprite("Scenery-Beach-Hale", "sprites/Scenery-Beach-Hale.png");
  loadSprite("Scenery-Palm-Tree-With-Crab", "sprites/Scenery-Palm-Tree-With-Crab.png");
  loadSprite("rock-formation-1", "sprites/rock-formation-1.png.png");

  // Items
  loadSprite("Item-Hatchet", "sprites/Item-Hatchet.png");
  loadSprite("Item-Stone_Shovel", "sprites/Item-Stone_Shovel.png");
  loadSprite("Item-Pickaxe", "sprites/pickaxe-1.png.png");

  // NPCs
  loadSprite(
    "NPC-Pele",
    "sprites/NPC-Pele.png",
    {
      sliceX: 4,
      sliceY: 4,
      anims: {
        dig: {
          from: 0,
          to: 5
        },
        idle: {
          from: 6,
          to: 12
        },
      }
    }
  );
  
  loadSprite(
    "NPC-Goat",
    "sprites/NPC-Goat.png",
    {
      sliceX: 2,
      sliceY: 3,
      anims: {
        bleat: {
          from: 0,
          to: 6
        },
        idle: {
          from: 0,
          to: 0
        },
      }
    }
  );

  // Player
  loadSprite(
    "Player",
    "sprites/Player.png",
    {
      sliceX: 4,
      sliceY: 4,
      anims: {
        idle: {
          from: 0,
          to: 0
        },
        walk: {
          from: 1,
          to: 7
        },
        chop: {
          from: 8,
          to: 13
        },
        jump: {
          from: 14,
          to: 14
        },
      }
    }
  );
  
  loadSprite("Missing", "sprites/Missing.png");

  // Dynamic loading wasn't working, so this is in the HTML file now.
  //loadTrueType("hanalei", "fonts/HanaleiFill.ttf");

  loadSound("Bleeps_Of_Joy(IGT)", "sounds/Bleeps_Of_Joy(IGT).mp3");
  loadSound("Progression(Purplemaia Kajam)", "sounds/Progression(Purplemaia Kajam).mp3");
  loadSound("Slip_Past(IGT)", "sounds/Slip_Past(IGT).mp3");
  loadSound("Soothing_and_Fading(IGT)", "sounds/Soothing_and_Fading(IGT).mp3");
  loadSound("Sparked(IGT)", "sounds/Sparked(IGT).mp3");
  loadSound("Venture(IGT)", "sounds/Venture(IGT).mp3");
  loadSound("Jump(Purplemaia_Kajam_SFX)", "sounds/Jump(Purplemaia_Kajam_SFX).mp3");
  loadSound("Axe(Purplemaia_Kajam_SFX)", "sounds/Axe(Purplemaia_Kajam_SFX).mp3");
  loadSound("Shoveling(Purplemaia_Kajam_SFX)", "sounds/Shoveling(Purplemaia_Kajam_SFX).mp3");
}