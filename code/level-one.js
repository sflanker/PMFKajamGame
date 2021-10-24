import loadLevel from './level-loader';
import patrol from "./component-patrol";
import initializePlayer from "./player";

export default function initializeLevelOne() {

  // define what each symbol means in the level graph
  const levelConf =
  {
    // grid size
    width: 32,
    height: 32,
    // define each object as a list of components
    "=": () =>
      [
        sprite("UnbreakableSand"),
        area(),
        solid(),
        origin("bot"),
      ],
    "b": () =>
      [
        sprite("breakableSand"),
        area(),
        solid(),
        origin("bot"),
        "breakable",
      ],
    "^": () =>
      [
        sprite("tree", { width: 32, height: 32 }),
        scale(10),
        area({ scale: 0.2 }),
        origin("bot"),
        "searchable",
        "holdsWood",
      ],
    "#": () =>
      [
        sprite("wood", { width: 32, height: 32 }),
        area(),
        scale(2),
        origin("bot"),
        body(),
        "wood",
      ],
    "-": () =>
      [
        sprite("inventory", { width: 32, height: 32 }),
        scale(2),
        origin("botleft"),
        "inventory",
      ],
    ">": () =>
      [
        sprite("googoly", { width: 32, height: 32 }),
        area(),
        origin("bot"),
        body(),
        patrol(),
        "enemy",
      ],
    "@": () =>
      [
        sprite("portal", { width: 32, height: 32 }),
        area({ scale: 0.5, }),
        origin("bot"),
        pos(0, -12),
        "portal",
      ],
  };

  const TileSize = 32;
  const TileSpriteOpts = { width: TileSize, height: TileSize };

  scene('test', async () => {
    const level = await loadLevel(
      'sprites/Kaena-Level-1-v1.png',
      {
        width: TileSize,
        height: TileSize,
        fast: true,
        // Missing color tile
        '?': () => [
          sprite('portal', TileSpriteOpts),
        ]
      },
      {
        '#000000-=': () => [
          sprite('box', TileSpriteOpts),
          area(),
          solid(),
          'bedrock'
        ],
        "#9b870c-=": () => [
          sprite("UnbreakableSand", TileSpriteOpt),
          area(),
          solid(),
          origin("bot"),
        ],
        "b": () => [
          sprite("breakableSand"),
          area(),
          solid(),
          origin("bot"),
          "breakable",
        ],
        "^": () => [
          sprite("tree", { width: 32, height: 32 }),
          scale(10),
          area({ scale: 0.2 }),
          origin("bot"),
          "searchable",
          "holdsWood",
        ]
      }
    );

    add([
      text(''),
      // pos(-width() / 2 + 10, -height() / 2 + 10),
      pos(0, 0),
      fixed(),
      "fps-display"
    ]);

    action("fps-display", obj => {
      obj.text = `${debug.fps()} (${debug.objCount()})`;
    });

    const player = initializePlayer(level);

    player.collides("portal", () => {
      go("win");
    });
  });
}