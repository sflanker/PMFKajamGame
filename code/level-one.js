import loadLevel from "./level-loader";
import initializePlayer from "./old-player";

export default function initializeLevelOne() {
  const TileSize = 32;
  const TileSpriteOpts = { width: TileSize, height: TileSize };

  scene("level-one", async () => {
    const level = await loadLevel(
      "sprites/Level-One-Map-v2.png",
      {
        width: TileSize,
        height: TileSize,
        fast: true,
        // Missing color tile
        "?": () => [
          sprite("Missing", TileSpriteOpts),
          origin("bottom"),
        ]
      },
      {
        "#000000-=": () => [
          sprite("Tile-Bedrock", TileSpriteOpts),
          origin("bottom"),
          area(),
          solid(),
          "bedrock"
        ],
        "#9b870c-#": () => [
          sprite("Tile-Sand-Unbreakable", TileSpriteOpts),
          origin("bottom"),
          area(),
          solid(),
        ],
        "#fdee73-*": () => [
          sprite("Tile-Sand", TileSpriteOpts),
          origin("bottom"),
          area(),
          solid(),
          "breakable",
          // TODO: randomly drop shells?
        ],
        "#3d3838": () => [
          sprite("Tile-Rock", TileSpriteOpts),
          origin("bottom"),
          area(),
          solid(),
          "rock",
        ],
        "#757575": () => [
          sprite("Tile-Cave", TileSpriteOpts),
          origin("bottom"),
          "cave"
        ],
        "#613000": () => [
          sprite("Tile-Planks", TileSpriteOpts),
          origin("bottom"),
          area(),
          solid(),
          "planks"
        ],
        "#dc6600": () => [
          sprite("Tile-Thatch", TileSpriteOpts),
          origin("bottom"),
          area(),
          solid(),
          "thatch"
        ],
        "#0040cb": () => [
          sprite("Tile-Water", TileSpriteOpts),
          origin("bottom"),
          "water"
        ],
        "#ff0000": () => [
          sprite("Tile-Lava", TileSpriteOpts),
          origin("bottom"),
          "lava"
          // TODO: deal damage
        ],
        "#ea00ff": () => [
          sprite("NPC-Pele", { width: 128, height: 128, anim: "idle" }),
          origin("bottom"),
          area(), 
          "pele"
          // TODO: add behavior (use o'o, throw lava in random trajectories)
        ],
        "#ffffff": () => [
          sprite("NPC-Goat", { width: 128, height: 128, anim: "idle" }),
          origin("bottom"),
          "goat"
          // TODO: bleat at random?
        ],
        "#006400-|": () => [
          sprite("Scenery-Palm-Tree-With-Crab"),
          origin("bottom"),
          //scale(2),
          area(),
          "searchable",
          { resourceType: "wood" },
        ],
        "#6e039d": () => [
          sprite("Scenery-Beach-Hale"),
          "hale"
        ],
      }
    );

    debugger;
    const player = initializePlayer(level, { spawn: vec2(TileSize * 50, TileSize * 29) });
  });
}