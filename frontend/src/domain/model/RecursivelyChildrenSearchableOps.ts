import MNode from '~/domain/model/MNode'
import DropPosition from '~/domain/model/DropPosition'
import Children from '~/domain/model/Children'

type RecursivelyChildrenSearchableOps = {
  children: Children

  findNodeById(id: string): MNode | undefined

  findNodeByPosition(position: DropPosition): MNode | undefined

  findHeadNode(id: string): MNode | undefined

  findNodeIsSelected(): MNode | undefined

  findChildrenContainsId(id: string): Children | undefined
}

export const recursivelyChildrenSearchableOpsImpl: RecursivelyChildrenSearchableOps = Object.freeze(
  {
    children: {} as Children,

    findNodeById(id: string): MNode | undefined {
      const child = this.children.nodes.find((child) => child.id === id)
      if (child) {
        return child
      }

      for (const child of this.children.nodes) {
        const target = child.children.recursively.findNodeById(id)

        if (target) {
          return target
        }
      }

      return undefined
    },

    findNodeByPosition(position: DropPosition): MNode | undefined {
      const child = this.children.nodes.find((child) => child.onArea(position))
      if (child) {
        return child
      }

      for (const child of this.children.nodes) {
        const target = child.children.recursively.findNodeByPosition(position)

        if (target) {
          return target
        }
      }

      return undefined
    },

    findHeadNode(id: string): MNode | undefined {
      const node = this.children.findNodeHasChildId(id)
      if (node !== undefined) {
        return node
      }

      for (const child of this.children.nodes) {
        const targetNode = child.children.recursively.findHeadNode(id)

        if (targetNode !== undefined) {
          return targetNode
        }
      }

      return undefined
    },

    findNodeIsSelected(): MNode | undefined {
      const selectedNode = this.children.nodes.find((child) => child.isSelected)
      if (selectedNode) {
        return selectedNode
      }

      for (const child of this.children.nodes) {
        const foundNode = child.children.recursively.findNodeIsSelected()

        if (foundNode) {
          return foundNode
        }
      }

      return undefined
    },

    findChildrenContainsId(id: string): Children | undefined {
      const include = this.children.nodes.map((child) => child.id).includes(id)
      if (include) {
        return this.children
      }

      for (const child of this.children.nodes) {
        const children = child.children.recursively.findChildrenContainsId(id)

        if (children) {
          return children
        }
      }

      return undefined
    },
  }
)

export default RecursivelyChildrenSearchableOps
