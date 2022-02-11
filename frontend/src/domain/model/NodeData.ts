import DropPosition from "~/domain/model/DropPosition";

// Ratio of width representing tail area of node.
const tailAreaRatio = 0.2;

type NodeData = {
  id: string;
  text: string;
  width: number;
  height: number;
  top: number;
  left: number;
  isHidden: boolean;

  onArea(position: DropPosition): boolean;

  inXRange(left: number): boolean;

  inYRange(top: number): boolean;

  onUpper(top: number): boolean;

  onTail(left: number): boolean;
};

export const nodeDataImpl: NodeData = {
  // an id for identify when updating node
  id: "",

  // an text of node
  text: "",

  // width including margin
  width: 0,

  // height including height
  height: 0,

  // node top value of style
  top: 0,

  // node left value of style
  left: 0,

  isHidden: false,

  onArea(position: DropPosition): boolean {
    return this.inXRange(position.left) && this.inYRange(position.top);
  },

  // TODO Respond to left map.
  //   - Maybe invert width when left map
  inXRange(left: number): boolean {
    return this.left < left && left < this.left + this.width;
  },

  inYRange(top: number): boolean {
    return this.top < top && top < this.top + this.height;
  },

  onUpper(top: number): boolean {
    const center = this.top + this.height / 2;

    return this.top < top && top < center;
  },

  // TODO Respond to left map.
  //   - Maybe invert width when left map
  onTail(left: number): boolean {
    const border = this.left + this.width * (1 - tailAreaRatio);

    return border < left && left < this.left + this.width;
  },
};
Object.freeze(nodeDataImpl);

export default NodeData;
