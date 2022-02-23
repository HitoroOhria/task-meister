import NodeData, { nodeDataImpl } from '~/domain/model/NodeData'

// type to distinguish from Node.
export const rootNodeType = 'rootNode'

type RootNode = NodeData & {
  type: typeof rootNodeType

  updatePlacement(): void

  updateLateral(): void

  updateVertical(): void
}

export const newRootNode = (id: string, text: string): RootNode => {
  return {
    ...rootNodeImpl,
    id: id,
    text: text,
  }
}

export const rootNodeImpl: RootNode = {
  ...nodeDataImpl,

  type: rootNodeType,

  updatePlacement() {
    this.updateLateral()
    this.updateVertical()
  },

  updateLateral() {
    this.setWith()
    this.left = -this.width / 2
  },

  updateVertical() {
    this.setHeight()
    this.top = -this.height / 2
  },
}
Object.freeze(rootNodeImpl)

export default RootNode
