export type Rect = {
  top: number,
  left: number,
  bottom: number,
  right: number
}

const getWidth = (bounds: Rect) => bounds.right - bounds.left + 1;
const getHeight = (bounds: Rect) => bounds.bottom - bounds.top + 1;

type MapFn<T, U> = ((item: T, x: number, y: number) => U) | ((item: T) => U);
type IterateFn<T> = ((item: T, x: number, y: number) => void) | ((item: T) => void);

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
      let subSize = leafSize * (2 ** (levels - 1));
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
    bottom: items.length - 1,
    right: items.map(r => r.length).reduce((max, v) => v > max ? v : max) - 1
  });
}


export abstract class QuadTree<T> {
  constructor(public bounds: Rect) {
  }

  map<U>(fn: MapFn<T, U>): QuadTree<U> {
    let newItems: U[][] = [];
    for (let i = this.bounds.top; i <= this.bounds.bottom; i++) {
      newItems[i] = [];
    }

    return this.mapInto(newItems, fn);
  }

  abstract mapInto<U>(newItems: U[][], fn: MapFn<T, U>): QuadTree<U>;

  iterateAll(fn: IterateFn<T>): void {
    this.iterate(this.bounds, fn);
  }

  abstract iterate(bounds: Rect, fn: IterateFn<T>): void;

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
  constructor(
    bounds: Rect,
    private items: T[][],
    private itemsTop: number = 0,
    private itemsLeft: number = 0) {

    super(bounds);
  }

  map<U>(fn: MapFn<T, U>): QuadTree<U> {
    // For efficiency, pack data into the top left of the array
    let newItems = [];
    for (let r = this.bounds.top; r <= this.bounds.bottom; r++) {
      newItems[r - this.bounds.top] = [];
      if (this.items[r - this.itemsTop]) {
        let rowLen = this.items[r - this.itemsTop].length;
        for (let c = this.bounds.left; c <= this.bounds.right && c - this.itemsLeft < rowLen; c++) {
          newItems[r - this.bounds.top][c - this.bounds.left] =
          fn(this.items[r - this.itemsTop][c - this.itemsLeft], c, r);
        }
      }
    }

    return new QuadTreeLeaf<U>(this.bounds, newItems, this.bounds.top, this.bounds.left);
  }

  mapInto<U>(newItems: U[][], fn: MapFn<T, U>): QuadTree<U> {
    for (let r = this.bounds.top; r <= this.bounds.bottom; r++) {
      if (this.items[r - this.itemsTop]) {
        let rowLen = this.items[r - this.itemsTop].length;
        for (let c = this.bounds.left; c <= this.bounds.right && c - this.itemsLeft < rowLen; c++) {
          newItems[r][c] = fn(this.items[r - this.itemsTop][c - this.itemsLeft], c, r);
        }
      }
    }

    return new QuadTreeLeaf<U>(this.bounds, newItems);
  }

  iterate(bounds: Rect, fn: IterateFn<T>): void {
    let top = Math.max(bounds.top, this.bounds.top);
    let left = Math.max(bounds.left, this.bounds.left);
    let bottom = Math.min(bounds.bottom, this.bounds.bottom);
    let right = Math.min(bounds.right, this.bounds.right);

    for (let r = top; r <= bottom; r++) {
      if (this.items[r - this.itemsTop]) {
        let rowLen = this.items[r - this.itemsTop].length;
        for (let c = left; c <= right && c - this.itemsLeft < rowLen; c++) {
          fn(this.items[r - this.itemsTop][c - this.itemsLeft], c, r);
        }
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

  mapInto<U>(newItems: U[][], fn: MapFn<T, U>): QuadTree<U> {
    let newQuads: QuadTree<U>[][] = [];
    for (let r = 0; r < this.quads.length; r++) {
      newQuads[r] = [];
      for (let c = 0; c < this.quads[r].length; c++) {
        newQuads[r][c] = this.quads[r][c].mapInto(newItems, fn);
      }
    }

    return new QuadTreeNode(this.bounds, newQuads);
  }

  iterate(bounds: Rect, fn: IterateFn<T>): void {
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
        for (let c = 0; c < this.quads[r].length; c++) {
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