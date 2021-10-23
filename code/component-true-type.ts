import { Color, Comp, SpriteData } from "kaboom";
import instance from "./kaboom-instance";

const { loadSprite, drawSprite } = instance;

// TODO: make this block the game from starting until we can be sure the font is available (need a library for that to work).
export function loadTrueType(name: string, url: string) : void {
  let newStyle = document.createElement("style");
  newStyle.appendChild(
    document.createTextNode(
      `\n@font-face {\nfont-family: ${name};\nsrc: url(${url});\n}\n`
    )
  );

  document.head.appendChild(newStyle);
}

interface TrueTypeConf {
  /**
	 * Height of text.
	 */
	size?: number;
	/**
	 * The font to use.
	 */
	font?: string;
  fontStyle?: string;
  align?: "left" | "right" | "center";
  lineSpacing?: number;
  color?: string | Color;
  outline?: string | Color;
  outlineWidth?: number;
}

interface TrueTypeComp extends Comp {
  width: number;
  height: number;
}

export function trueType(text: string, options?: TrueTypeConf): TrueTypeComp {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const scale = window.devicePixelRatio;
  
  // Prepare the font to be able to measure
  let fontFamily = options?.font || "monospace"
  let fontSize = (options?.size || 24) * scale;
  let lineSpacing = options?.lineSpacing || 1;
  let font = ctx.font =
    (options?.fontStyle ? `${options?.fontStyle} ` : "") +
    `${fontSize}px '${fontFamily}'`;
  
  let lines = text.split('\n');
  const textMetrics = ctx.measureText(text);
  
  let width = lines.map(s => ctx.measureText(s).width).reduce((max, w) => w > max ? w : max);
  let height = lines.length * fontSize +
    (lines.length - 1) * fontSize * (lineSpacing - 1);
  
  // Resize canvas to match text size 
  canvas.width = width;
  canvas.height = height;
  
  // Re-apply font since canvas is resized?
  ctx.font = font;
  
  ctx.textAlign = options?.align || "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = toCssColor(options?.color) || "black";
  let stroke = !!(options?.outline);
  if (stroke) {
    ctx.strokeStyle = toCssColor(options.outline);
    ctx.lineWidth = options?.outlineWidth || 1;
  }

  let y = fontSize / 2;
  let x: number;
  switch (ctx.textAlign) {
    case "left":
      x = 0;
      break;
    case "right":
      x = width;
      break;
    case "center":
    default:
      // why isn't this canvas.width / 2???
      x = width / 2;
      break;
  }
  
  for (let line of lines) {
    ctx.fillText(line, x, y);
    if (stroke) {
      ctx.strokeText(line, 0, 0);
    }

    y += fontSize * lineSpacing;
  }

  // Create a SpriteData from ctx
  let textSprite : SpriteData | undefined = undefined;

  loadSprite(`${JSON.stringify(options)}-${text}`, canvas)
    .then(s => {
      textSprite = s;
    })
    .catch(e => {
      debug.error(e);
    })

  return {
    width: width / scale,
    height: height / scale,
    draw: function() {
      if (textSprite) {
        drawSprite(textSprite, {  ...getRenderProps(this), width: width / scale, height: height / scale });
      }
    }
  }
}

// Respect other components
function getRenderProps(obj: any) {
	return {
		pos: obj.pos,
		scale: obj.scale,
		color: obj.color,
		opacity: obj.opacity,
		angle: obj.angle,
		origin: obj.origin,
		outline: obj.outline,
		uniform: obj.uniform,
	};
}

function toCssColor(c?: Color | string) : string | undefined {
  if (c) {
    if (typeof c === "string") {
      return c;
    } else {
      return `#${toHex2(c.r)}${toHex2(c.g)}${toHex2(c.b)}`
    }
  }
}

function toHex2(num) {
  let str =  num.toString(16);
  return str.length >= 2 ? str : `0${str}`;
}