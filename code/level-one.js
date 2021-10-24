import loadLevel from "./level-loader";
import initializePlayer from "./player";

export default function initializeLevelOne() {
  const TileSize = 32;
  const TileSpriteOpts = { width: TileSize, height: TileSize };

  scene("level-one", async () => {
    const music = play("Venture(IGT)", {
      volume: 0.8,
      loop: true
    });

    let sceneCleanup = add([
      "scene-cleanup"
    ]);

    sceneCleanup.on("destroy", () => {
      music.stop();
    });

    layers(
      [
        "background",
        "background-scenery",
        "tiles",
        "foreground-scenery",
        "player"
      ],
      "tiles"
    );

    let background = add([
      sprite("Beach-Background"),
      pos(width() / 2, height() / 2),
      origin("center"),
      scale(1),
      layer("background"),
      fixed()
    ]);
    background.scaleTo(Math.max(
      (width() * 1.4) / background.width,
      (height() * 1.2) / background.height
    ));

    const level = await loadLevel(
      "sprites/Level-One-Map-v2.png",
      {
        width: TileSize,
        height: TileSize,
        fast: true,
        // Missing color tile
        "?": () => [
          sprite("Missing", TileSpriteOpts),
          origin("bot"),
        ]
      },
      {
        "#000000-=": () => [
          sprite("Tile-Bedrock", TileSpriteOpts),
          origin("bot"),
          area(),
          solid(),
          "bedrock"
        ],
        "#9b870c-#": () => [
          sprite("Tile-Sand-Unbreakable", TileSpriteOpts),
          origin("bot"),
          area(),
          solid(),
        ],
        "#fdee73-*": () => [
          sprite("Tile-Sand", TileSpriteOpts),
          origin("bot"),
          area(),
          solid(),
          "breakable",
          // TODO: randomly drop shells?
        ],
        "#3d3838": () => [
          sprite("Tile-Rock", TileSpriteOpts),
          origin("bot"),
          area(),
          solid(),
          "rock",
        ],
        "#757575": () => [
          sprite("Tile-Cave", TileSpriteOpts),
          origin("bot"),
          "cave"
        ],
        "#613000": () => [
          sprite("Tile-Planks", TileSpriteOpts),
          origin("bot"),
          area(),
          solid(),
          "planks"
        ],
        "#dc6600": () => [
          sprite("Tile-Thatch", TileSpriteOpts),
          origin("bot"),
          area(),
          solid(),
          "thatch"
        ],
        "#0040cb": () => [
          sprite("Tile-Water", TileSpriteOpts),
          origin("bot"),
          "water"
        ],
        "#ff0000": () => [
          sprite("Tile-Lava", TileSpriteOpts),
          origin("bot"),
          "lava"
          // TODO: deal damage
        ],
        "#ea00ff": () => [
          sprite("NPC-Pele", { width: 128, height: 128, anim: "idle" }),
          origin("bot"),
          area(),
          layer("foreground-scenery"),
          "pele"
          // TODO: add behavior (use o'o, throw lava in random trajectories)
        ],
        "#ffffff": () => [
          sprite("NPC-Goat", { width: 128, height: 128, anim: "idle" }),
          origin("bot"),
          layer("foreground-scenery"),
          "goat"
          // TODO: bleat at random?
        ],
        "#006400-|": () => [
          sprite("Scenery-Palm-Tree-With-Crab"),
          origin("bot"),
          scale(2),
          area(),
          layer("foreground-scenery"),
          "searchable",
          { resourceType: "wood" },
        ],
        "#6e039d": () => [
          sprite("Scenery-Beach-Hale"),
          origin("bot"),
          scale(2),
          layer("background-scenery"),
          "hale"
        ],
      }
    );

    //debugger;
    const player = initializePlayer(level, { spawn: vec2(TileSize * 50, TileSize * 20) });

    action(() => {
      background.pos.x =
        width() / 2 -
        (player.pos.x / level.width() * 0.8 - 0.4) * width() / background.scale.x;
      background.pos.y = 
        height() / 2 -
        (player.pos.y / level.height() * 0.4 - 0.2) * height() / background.scale.y;
    });
  });
}