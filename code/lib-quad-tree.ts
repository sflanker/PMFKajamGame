export type Rect = {
  top: number,
  left: number,
  bottom: number,
  right: number
}

const getWidth = (bounds: Rect) => bounds.right - bounds.left + 1;
const getHeight = (bounds: Rect) => bounds.bottom - bounds.top + 1;

export function makeQuadTree<T>(items: T[][], leafSize: number = 16): QuadTree<T> {
  function helper(bounds: Rect): QuadTree<T> {
    let w = getWidth(bounds);
    let h = getHeight(bounds);

    if (w <= leafSize && h <= leafSize) {
      return new QuadTreeLeaf<T>(bounds, items);
    } else {
      let levels = Math.max(
        Math.ceil(Math.log2(w / leafSize)),
        Math.ceil(Math.log2(h / leafSize))
      );
      let subSize = leafSize * ((levels - 1) ** 2);
      let rows = Math.ceil(w / subSize);
      let cols = Math.ceil(h / subSize);
      let subs: QuadTree<T>[][] = [];
      for (let r = 0; r < rows; r++) {
        subs[r] = [];
        for (let c = 0; c < cols; c++) {
          let subBounds = {
            top: bounds.top + r * subSize,
            left: bounds.left + c * subSize,
            bottom: bounds.top + r * subSize + subSize - 1,
            right: bounds.left + c * subSize + subSize - 1
          };
          subs[r][c] = helper(subBounds);
        }
      }

      return new QuadTreeNode<T>(bounds, subs);
    }
  }

  return helper({
    top: 0,
    left: 0,
    bottom: items.length + 1,
    right: items.map(r => r.length).reduce((max, v) => v > max ? v : max)
  });
}


export abstract class QuadTree<T> {
  constructor(public bounds: Rect) {
  }

  map<U>(fn: (item: T) => U): QuadTree<U> {
    let newItems: U[][] = [];
    for (let i = this.bounds.top; i <= this.bounds.bottom; i++) {
      newItems[i] = [];
    }

    return this.mapInto(newItems, fn);
  }

  abstract mapInto<U>(newItems: U[][], fn: (item: T) => U): QuadTree<U>;

  iterateAll(fn: (item: T) => void): void {
    this.iterate(this.bounds, fn);
  }

  abstract iterate(bounds: Rect, fn: (item: T) => void): void;

  // Get all the quads that the specified boundary overlap
  abstract getAllQuads(bounds: Rect): QuadTreeLeaf<T>[][];

  isOverlapping(bounds: Rect): boolean {
    return (
      this.bounds.top <= bounds.bottom &&
      this.bounds.left <= bounds.right &&
      this.bounds.bottom >= bounds.top &&
      this.bounds.right >= bounds.left
    );
  }
}

class QuadTreeLeaf<T> extends QuadTree<T> {
  constructor(bounds: Rect, public items: T[][]) {
    super(bounds);
  }

  mapInto<U>(newItems: U[][], fn: (item: T) => U): QuadTree<U> {
    for (let r = this.bounds.top; r <= this.bounds.bottom; r++) {
      for (let c = this.bounds.left; c <= this.bounds.right; c++) {
        newItems[r][c] = fn(this.items[r][c]);
      }
    }

    return new QuadTreeLeaf<U>(this.bounds, newItems);
  }

  iterate(bounds: Rect, fn: (item: T) => void): void {
    let top = Math.max(bounds.top, this.bounds.top);
    let left = Math.max(bounds.left, this.bounds.left);
    let bottom = Math.min(bounds.bottom, this.bounds.bottom);
    let right = Math.min(bounds.right, this.bounds.right);

    for (let r = top; r <= bottom; r++) {
      for (let c = left; c <= right; c++) {
        fn(this.items[r][c]);
      }
    }
  }

  getAllQuads(bounds: Rect): QuadTreeLeaf<T>[][] {
    if (this.isOverlapping(bounds)) {
      return [[this]];
    } else {
      return [];
    }
  }
}

class QuadTreeNode<T> extends QuadTree<T> {
  constructor(bounds: Rect, public quads: QuadTree<T>[][]) {
    super(bounds);
  }

  mapInto<U>(newItems: U[][], fn: (item: T) => U): QuadTree<U> {
    let newQuads: QuadTree<U>[][] = [];
    for (let r = 0; r < this.quads.length; r++) {
      newQuads[r] = [];
      for (let c = 0; c < this.quads[r].length; c++) {
        newQuads[r][c] = this.quads[r][c].mapInto(newItems, fn);
      }
    }

    return new QuadTreeNode(this.bounds, newQuads);
  }

  iterate(bounds: Rect, fn: (item: T) => void): void {
    if (this.isOverlapping(bounds)) {
      for (let r = 0; r < this.quads.length; r++) {
        for (let c = 0; c < this.quads[r].length; c++) {
          this.quads[r][c].iterate(bounds, fn);
        }
      }
    }
  }

  getAllQuads(bounds: Rect): QuadTreeLeaf<T>[][] {
    let result = []
    if (this.isOverlapping(bounds)) {
      for (let r = 0; r < this.quads.length; r++) {
        let rows = [];
        for (let c = 0; c < this.quads.length; c++) {
          let overlapping = this.quads[r][c].getAllQuads(bounds);
          for (let sr = 0; sr < overlapping.length; sr++) {
            if (rows[sr]) {
              rows[sr].push(...overlapping[sr]);
            } else {
              rows[sr] = overlapping[sr];
            }
          }
        }
        result.push(...rows);
      }
    }
    return result;
  }
}