import ArrowKey, { arrowKeys } from '~/enum/ArrowKeys'
import MMindMap from '~/domain/model/MMindMap'
import { assertNever, newNotFoundNodeErr } from '~/util/ExceptionUtil'
import MRootNode, { rootNodeType } from '~/domain/model/MRootNode'
import MNode from '~/domain/model/MNode'

// UseCase of arrow key.
class ArrowKeyUseCase {
  handleKeydown(mindMap: MMindMap, arrowKey: ArrowKey): MMindMap {
    const selectedNode = mindMap.findNodeIsSelected()
    if (!selectedNode) {
      return mindMap
    }

    switch (arrowKey) {
      case arrowKeys.Up:
        return this.selectTopNode(mindMap, selectedNode)
      case arrowKeys.Down:
        return this.selectBottomNode(mindMap, selectedNode)
      case arrowKeys.Right:
        return this.selectTailNode(mindMap, selectedNode)
      case arrowKeys.Left:
        return this.selectHeadNode(mindMap, selectedNode)
      default:
        assertNever(arrowKey, `Not defined arrow key. arrow key = ${arrowKey}`)
        return mindMap
    }
  }

  // Select top node of currently selected node in MindMap.
  selectTopNode(mindMap: MMindMap, selectedNode: MRootNode | MNode): MMindMap {
    if (mindMap.rootNode.isSelected) {
      return mindMap
    }

    mindMap.deselectNode()

    const topNode = mindMap.rightMap.children.recursively
      .findChildrenContainsId(selectedNode.id)
      ?.findTopNodeOf(selectedNode.id)
    if (!topNode) {
      throw newNotFoundNodeErr(selectedNode.id)
    }

    topNode.isSelected = true
    return mindMap
  }

  // Select bottom node of currently selected node in MindMap.
  selectBottomNode(mindMap: MMindMap, selectedNode: MRootNode | MNode): MMindMap {
    if (mindMap.rootNode.isSelected) {
      return mindMap
    }

    mindMap.deselectNode()

    const bottomNode = mindMap.rightMap.children.recursively
      .findChildrenContainsId(selectedNode.id)
      ?.findBottomNodeOf(selectedNode.id)
    if (!bottomNode) {
      throw newNotFoundNodeErr(selectedNode.id)
    }

    bottomNode.isSelected = true
    return mindMap
  }

  // Select head node of currently selected node in MindMap.
  selectHeadNode(mindMap: MMindMap, selectedNode: MRootNode | MNode): MMindMap {
    if (mindMap.rootNode.isSelected) {
      return mindMap
    }

    const headNode = mindMap.findHeadNode(selectedNode.id)
    if (!headNode) {
      return mindMap
    }

    mindMap.deselectNode()
    headNode.isSelected = true

    return mindMap
  }

  // Select tail node of currently selected node in MindMap.
  selectTailNode(mindMap: MMindMap, selectedNode: MRootNode | MNode): MMindMap {
    if (selectedNode.type === rootNodeType) {
      mindMap.selectTail()
      return mindMap
    }
    if (selectedNode.collapsed) {
      return mindMap
    }

    const tailNode = mindMap.rightMap.children.recursively
      .findChildrenContainsId(selectedNode.id)
      ?.findTailNodeOf(selectedNode.id)
    if (!tailNode) {
      return mindMap
    }

    mindMap.deselectNode()
    tailNode.isSelected = true

    return mindMap
  }
}

export default ArrowKeyUseCase
