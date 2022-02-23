import NodeData, {nodeDataImpl} from '~/domain/model/NodeData'
import PathLine, {newPathLine, pathLineImpl} from '~/domain/model/PathLine'

// type to distinguish from Node.
export const rootNodeType = 'rootNode'

type RootNode = NodeData & {
  type: typeof rootNodeType
  pathLine: PathLine

  updatePlacement(): void

  updateLateral(): void

  updateVertical(): void

  updatePathLine(): void
}

export const newRootNode = (id: string, text: string): RootNode => {
  return {
    ...rootNodeImpl,
    id: id,
    text: text,
    pathLine: newPathLine(),
  }
}

export const rootNodeImpl: RootNode = {
  ...nodeDataImpl,

  type: rootNodeType,
  pathLine: pathLineImpl,

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

  updatePathLine() {
    this.pathLine.updatePoints(this)
  },
}
Object.freeze(rootNodeImpl)

export default RootNode
