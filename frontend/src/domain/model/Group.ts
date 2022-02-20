import Children from '~/domain/model/Children'

// Total area of node and its children.
// Group has area and location information.
type Group = {
  // total height of node and children.
  height: number

  // group top value of style.
  top: number

  isHidden: boolean

  updateHeight(isHidden: boolean, nodeHeight: number, children: Children): void

  setTop(parentGroupTop: number, fromGroupHeight: number): void
}

export const newGroup = (): Group => {
  return {
    ...groupImpl,
  }
}

export const groupImpl: Group = {
  height: 0,
  top: 0,
  isHidden: false,

  updateHeight(nodeIsHidden: boolean, nodeHeight: number, children: Children) {
    if (nodeIsHidden) {
      this.height = 0
      return
    }

    children.recursively.updateGroupAndChildrenHeight()
    this.height = nodeHeight > children.height ? nodeHeight : children.height
  },

  setTop(parentGroupTop: number, fromGroupHeight: number) {
    this.top = parentGroupTop + fromGroupHeight
  },
}

Object.freeze(groupImpl)

export default Group
