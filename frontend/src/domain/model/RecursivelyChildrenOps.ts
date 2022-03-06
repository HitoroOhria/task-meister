import MNode from '~/domain/model/MNode'
import Children from '~/domain/model/Children'
import RecursivelyChildrenSearchableOps, {
  recursivelyChildrenSearchableOpsImpl,
} from '~/domain/model/RecursivelyChildrenSearchableOps'
import RecursivelyChildrenUpdatableOps, {
  recursivelyChildrenUpdatableOpsImpl,
} from '~/domain/model/RecursivelyChildrenUpdatableOps'

// RecursivelyChildrenOps is recursive operation of children nodes.
type RecursivelyChildrenOps = RecursivelyChildrenSearchableOps &
  RecursivelyChildrenUpdatableOps & {
    // Operation target children.
    children: Children

    isInputting(): boolean

    nodeTextIsEditing(): boolean

    estimateTimeIsInputting(): boolean

    estimated(): boolean

    displayedCheckbox(): boolean

    removeNodeById(id: string): MNode

    toggleHidden(): void

    deselectNode(): void
  }

export const newRecursivelyChildrenOps = (children: Children): RecursivelyChildrenOps => {
  return {
    ...recursivelyChildrenOpsImpl,
    children: children,
  }
}

export const recursivelyChildrenOpsImpl: RecursivelyChildrenOps = Object.freeze({
  ...recursivelyChildrenSearchableOpsImpl,
  ...recursivelyChildrenUpdatableOpsImpl,

  children: {} as Children,

  isInputting(): boolean {
    return this.nodeTextIsEditing() || this.estimateTimeIsInputting()
  },

  nodeTextIsEditing(): boolean {
    const editingChild = this.children.nodes.find((child) => child.isInputting)
    if (editingChild) {
      return true
    }

    return !!this.children.nodes.find((child) => child.children.recursively.nodeTextIsEditing())
  },

  estimateTimeIsInputting(): boolean {
    const editingChild = this.children.nodes.find((child) => child.content.estimateTime.isEditing)
    if (editingChild) {
      return true
    }

    return !!this.children.nodes.find((child) =>
      child.children.recursively.estimateTimeIsInputting()
    )
  },

  estimated(): boolean {
    const estimatedNode = this.children.nodes.find((node) => node.estimated())
    if (estimatedNode) {
      return true
    }

    return !!this.children.nodes.find((node) => node.children.recursively.estimated())
  },

  displayedCheckbox(): boolean {
    const displayedCheckbox = this.children.nodes
      .map((node) => node.content.checkbox)
      .find((checkbox) => !checkbox.hidden)
    if (displayedCheckbox) {
      return true
    }

    return !!this.children.nodes.find((node) => node.children.recursively.displayedCheckbox())
  },

  removeNodeById(id: string): MNode {
    const children = this.children.recursively.findChildrenContainsId(id)
    if (!children) {
      throw new Error(`Can not found children contains id. id = ${id}`)
    }

    return children.removeNode(id)
  },

  toggleHidden() {
    this.children.nodes.forEach((child) => (child.isHidden = !child.isHidden))
    this.children.nodes.forEach((child) => child.children.recursively.toggleHidden())
  },

  deselectNode() {
    const selectedNode = this.findNodeIsSelected()
    if (!selectedNode) return

    selectedNode.isSelected = false
  },
})

export default RecursivelyChildrenOps
