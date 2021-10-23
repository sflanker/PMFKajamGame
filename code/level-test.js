import loadLevel from './level-loader';
import initializePlayer from "./player"

export default function initializeLevelTest() {
  const TileSize = 32;
  const TileSpriteOpts = { width: TileSize, height: TileSize };

  scene('test', async () => {
    const level = await loadLevel(
      'sprites/Kaena-Level-1-v1-small.png',
      {
        width: TileSize,
        height: TileSize,
        // Missing color tile
        '?': () => [
          sprite('portal', TileSpriteOpts),
        ]
      },
      {
        '#000000-=': () =>[
          sprite('box', TileSpriteOpts),
          area(),
          solid(),
          'bedrock'
        ],
        '#9b870c-#': () => [
          sprite('grass', TileSpriteOpts),
          area(),
          solid(),
          'grass',
          'diggable'
        ]
      }
    );

    add([
      text(debug.fps().toString()),
      // pos(-width() / 2 + 10, -height() / 2 + 10),
      pos(0, 0),
      fixed(),
      "fps-display"
    ]);

    action("fps-display", obj => {
      obj.text = debug.fps().toString();
    });

    const player = initializePlayer(level);
  });
}