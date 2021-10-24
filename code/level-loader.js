const MaxColorSqDist = 48;

// Helper function to create a level
export default async function loadLevel(terrainPath, colorMap, options) {
  let terrainImage = await loadImage(terrainPath);

  // a array of { color: [r, g, b], colorKey: "#rrggbb" }
  // useed to simplify the color matching process
  let colorVectors = [];
  for (let key of Object.getOwnPropertyNames(colorMap)) {
    // parse color components
    let c;
    if (key.length === 4) {
      c = [parseHex(key[1]), parseHex(key[2]), parseHex(key[3])];
    } else if (key.length === 7) {
      c = [
        parseHex(key.slice(1, 3)),
        parseHex(key.slice(3, 5)),
        parseHex(key.slice(5, 7))
      ];
    }
    colorVectors.push({ color: c, colorKey: key });
  }

  let missing = {};

  let levelData = [];

  for (let y = 0; y < terrainImage.height; y++) {
    let row = [];
    for (let x = 0; x < terrainImage.width; x++) {
      let [r,g,b,a] = terrainImage.get(x, y);
      // Ignore transparent pixels
      if (a === 255) {
        let closest = undefined;
        for (let c of colorVectors) {
          let dr = c.color[0] - r;
          let dg = c.color[1] - g;
          let db = c.color[2] - b;
          let sqDist = dr ** 2 + dg ** 2 + db ** 2;
          if (!closest || sqDist < closest.sqDist) {
            closest = { ...c, sqDist };
          }
        }

        let symbol = closest.sqDist <= MaxColorSqDist && colorMap[closest.colorKey];
        if (symbol) {
          let hexColor = `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`;
          missing[hexColor] = closest.colorKey;
          row.push(symbol);
        } else {
          row.push('?');
        }
      } else {
        row.push(' ');
      }
    }

    levelData.push(row.join(''));
  }

  let level = addLevel(levelData, options);
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

function loadImage(terrainPath) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      let canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      let drawingContext = this.canvas.getContext('2d');

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
  constructor(drawingContext, width, height) {
    this.drawingContext = drawingContext;
    this.width = width;
    this.height = height;
  }

  get(x, y) {
    let imageData = this.drawingContext.getImageData(x, y, 1, 1);
    return imageData.data.slice(0, 4);
  }
}