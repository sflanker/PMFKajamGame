// Why is there no GameObj export?
import type { Level, LevelConf, Vec2, Character } from 'kaboom';
import instance from "./kaboom-instance";

const { add2, grid, pos, vec, addLevel } = instance;

const MaxColorSqDist = 48;

type LevelWithData = Level & { data?: string[] };

type ColorMap = { [key: string]: () => any };

type ColorInfo = {
  color: [number, number, number],
  colorKey: string,
  char: string
};

// Helper function to create a level
export default async function loadLevel(
  terrainPath: string,
  options: LevelConf,
  colorMap: ColorMap) : Promise<LevelWithData> {

  let terrainImage = await loadImage(terrainPath);

  // a array of { color: [r, g, b], colorKey: '#rrggbb' }
  // useed to simplify the color matching process
  let colorVectors : ColorInfo[] = [];

  let nextChar = 'A';
  let tileFactories : { [key: string]: () => any } = {};

  for (let key of Object.getOwnPropertyNames(colorMap)) {
    // parse color components
    let c : [number, number, number];
    let [hexColor, char] = key.split('-');
    if (hexColor.length === 4) {
      c = [parseHex(hexColor[1]), parseHex(hexColor[2]), parseHex(hexColor[3])];
    } else if (hexColor.length === 7) {
      c = [
        parseHex(hexColor.slice(1, 3)),
        parseHex(hexColor.slice(3, 5)),
        parseHex(hexColor.slice(5, 7))
      ];
    } else {
      throw new Error(`Unrecognized color format: ${hexColor}`)
    }

    if (!char) {
      char = nextChar;
      nextChar = String.fromCharCode(nextChar.charCodeAt(0) + 1);
      if (nextChar === '[') {
        nextChar = 'a';
      }
    }

    tileFactories[char] = colorMap[key];

    colorVectors.push({ color: c, colorKey: key, char });
  }

  let missing : { [key: string]: string } = {};

  let levelData : string[] = [];

  for (let y = 0; y < terrainImage.height; y++) {
    let row : string[] = [];
    for (let x = 0; x < (100 || terrainImage.width); x++) {
      let [r,g,b,a] = terrainImage.get(x, y);
      // Ignore transparent pixels
      if (a === 255) {
        let closest : ColorInfo & { sqDist: number } = undefined;
        for (let c of colorVectors) {
          let dr = c.color[0] - r;
          let dg = c.color[1] - g;
          let db = c.color[2] - b;
          let sqDist = dr ** 2 + dg ** 2 + db ** 2;
          if (!closest || sqDist < closest.sqDist) {
            closest = { ...c, sqDist };
          }
        }

        let char = closest.sqDist <= MaxColorSqDist && closest.char;
        if (typeof char === 'string') {
          row.push(char);
        } else {
          let hexColor = `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`;
          missing[hexColor] = closest.colorKey;
          row.push('?');
        }
      } else {
        row.push(' ');
      }
    }

    levelData.push(row.join(''));
  }

  for (let c of Object.getOwnPropertyNames(missing)) {
    console.warn(`Color ${c} found in level map with no matching tile definition. Closest match: ${missing[c]}`)
  }

  let level : LevelWithData = addLevel(levelData, { ...options, ...tileFactories });
    // new FastLevel(levelData, { ...options, ...tileFactories });
  level.data = levelData;
  return level;
}

function parseHex(str) {
  return parseInt(str, 16);
}

function toHex2(num) {
  let str =  num.toString(16);
  return str.length >= 2 ? str : `0${str}`;
}

function loadImage(terrainPath: string) : Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      let canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      let drawingContext = canvas.getContext('2d');

      drawingContext.drawImage(img, 0, 0);
      resolve(new ImageData(drawingContext, img.width, img.height));
    };

    img.onerror = reject;

    if (terrainPath.indexOf('data:image/') !== 0) {
      img.crossOrigin = 'Anonymous';
    }

    img.src = terrainPath;
  });
}

class ImageData {
  drawingContext: CanvasRenderingContext2D;
  width: number;
  height: number;

  constructor(
    drawingContext: CanvasRenderingContext2D,
    width: number,
    height: number) {

    this.drawingContext = drawingContext;
    this.width = width;
    this.height = height;
  }

  get(x: number, y: number): [number, number, number, number] {
    let imageData = this.drawingContext.getImageData(x, y, 1, 1);
    return [
      imageData.data[0],
      imageData.data[1],
      imageData.data[2],
      imageData.data[3],
    ];
  }
}

class FastLevel implements Level {
  private _offset: Vec2;

  private _rows: number;
  private _cols: number;

  private _objects: Character[] = [];

	width = () => this.options.width * this._cols;
	height = () => this.options.height * this._rows;
  offset = () => this._offset.clone();
  
	gridWidth = () => this.options.width;
	gridHeight = () => this.options.height;
  
  constructor(private map: string[], private options: LevelConf) {
    this._rows = map.length;
    this._cols = map.map(r => r.length).reduce((max, v) => v > max ? v : max);
    this._offset = vec2(options.pos ?? vec2(0, 0));
  }

  getPos(posOrX: Vec2 | number, y?: number): Vec2 {
    if (typeof posOrX === 'number') {
      return vec2(
        this._offset.x + posOrX * this.options.width,
        this._offset.y + (y ?? 0) * this.options.height
      );
    } else {
      return vec2(
        this._offset.x + posOrX.x * this.options.width,
        this._offset.y + posOrX.y * this.options.height
      );
    }
  }

	spawn(sym: string, posOrX: Vec2 | number, y?: number): Character {
    let p: Vec2;
    if (typeof posOrX === 'number') {
      p = vec2(posOrX, y ?? 0);
    } else {
      p = posOrX;
    }

    return this.spawnInto(this._objects, sym, p);
  }

  private spawnInto(list: Character[], sym: string, p: Vec2) {
    const comps = (() => {
      if (this.options[sym]) {
        if (typeof this.options[sym] !== "function") {
          throw new Error("level symbol def must be a function returning a component list");
        }
        return this.options[sym](p);
      } else if (this.options.any) {
        // Kaboom's type exports a bunk
        return (<any >this.options.any)(sym, p);
      }
    })();

    if (!comps) {
      return;
    }

    const worldPos = vec2(
      this._offset.x + p.x * this.options.width,
      this._offset.y + p.y * this.options.height
    );

    for (const comp of comps) {
      // offset by existing pos component
      if (comp.id === "pos") {
        worldPos.x += comp.pos.x;
        worldPos.y += comp.pos.y;
        break;
      }
    }

    comps.push(pos(worldPos));
    comps.push(grid(this, pos));

    const obj = add(comps);

    list.push(obj);

    return obj;
  }
  
	destroy() {

  }
}