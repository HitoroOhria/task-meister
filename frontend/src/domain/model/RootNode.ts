import NodeData, { nodeDataImpl } from "~/domain/model/NodeData";

type RootNode = NodeData & {
  updateLateral(width: number): void;

  updateVertical(height: number): void;
};

export const newRootNode = (id: string, text: string): RootNode => {
  return {
    ...rootNodeImpl,
    id: id,
    text: text
  };
};

export const rootNodeImpl: RootNode = {
  ...nodeDataImpl,

  updateLateral(width: number) {
    this.width = width;
    this.left = -width / 2;
  },

  updateVertical(height: number) {
    this.height = height;
    this.top = -height / 2;
  },
};
Object.freeze(rootNodeImpl);

export default RootNode;
