type Point = {
  x: number;
  y: number;

  toSpaceSeparated(): string;
};

export const newPoint = (x: number, y: number) => {
  return {
    ...pointImpl,
    x: x,
    y: y,
  };
};

export const pointImpl: Point = {
  x: 0,
  y: 0,

  toSpaceSeparated(): string {
    return [this.x, this.y].join(" ");
  },
};
Object.freeze(pointImpl);

export default Point;
