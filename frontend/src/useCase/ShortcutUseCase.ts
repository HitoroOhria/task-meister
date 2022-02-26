import MindMapData from '~/domain/model/MindMapData'
import MRootNode, { rootNodeType } from '~/domain/model/MRootNode'
import MNode, { newAddNode } from '~/domain/model/MNode'

import ArrowKeyUseCase from '~/useCase/ArrowKeyUseCase'

import Shortcut, { shortcuts } from '~/enum/Shortcut'

import { assertNever, newNotFoundChildrenErr, newNotFoundNodeErr } from '~/util/ExceptionUtil'
import MindMapUseCase from '~/useCase/MindMapUseCase'

class ShortcutUseCase {
  private mindMapUseCase: MindMapUseCase
  private arrowKeyUseCase: ArrowKeyUseCase

  constructor(mindMapUseCase: MindMapUseCase, arrowKeyUseCase: ArrowKeyUseCase) {
    this.mindMapUseCase = mindMapUseCase
    this.arrowKeyUseCase = arrowKeyUseCase
  }

  public handleKeydown(mindMapData: MindMapData, key: Shortcut): MindMapData {
    const selectedNode = mindMapData.findNodeIsSelected()
    if (!selectedNode) {
      return mindMapData
    }

    switch (key) {
      case shortcuts.Up:
      case shortcuts.Down:
      case shortcuts.Right:
      case shortcuts.Left:
        return this.arrowKeyUseCase.handleArrowKeyDown(mindMapData, key, selectedNode)
      case shortcuts.Space:
        return this.mindMapUseCase.toggleCollapse(mindMapData, selectedNode.id)
      case shortcuts.Tab:
        return this.addNodeToTail(mindMapData, selectedNode)
      case shortcuts.Enter:
        return this.addNodeToBottom(mindMapData, selectedNode)
      case shortcuts.Backspace:
        return this.deleteNode(mindMapData, selectedNode)
      case shortcuts.MetaE:
        return this.mindMapUseCase.enterNodeEditMode(mindMapData, selectedNode.id)
      case shortcuts.ShiftEnter:
      case shortcuts.F6:
        // Ignore
        return mindMapData
      default:
        assertNever(key, `Not defined key. key = ${key}`)
        return mindMapData
    }
  }

  public addNodeToTail(mindMapData: MindMapData, selectedNode: MRootNode | MNode): MindMapData {
    mindMapData.deselectNode()

    if (selectedNode.type === rootNodeType) {
      const addedNode = newAddNode(mindMapData.rootNode.width / 2)
      mindMapData.rightMap.children.nodes.push(addedNode)

      mindMapData.updateAllPlacement(addedNode.id)

      return mindMapData
    }

    // TODO Why set only left? There is top?
    const addedNode = newAddNode(selectedNode.left + selectedNode.width)
    selectedNode.children.nodes.push(addedNode)

    mindMapData.updateAllPlacement(addedNode.id)

    return mindMapData
  }

  public addNodeToBottom(mindMapData: MindMapData, selectedNode: MRootNode | MNode): MindMapData {
    if (mindMapData.rootNode.isSelected) {
      return mindMapData
    }

    mindMapData.deselectNode()

    const parentChildren = mindMapData.rightMap.children.recursively.findChildrenContainsId(
      selectedNode.id
    )
    if (!parentChildren) {
      throw newNotFoundChildrenErr(selectedNode.id)
    }

    const addedNode = mindMapData.isFirstLayerNode(selectedNode.id)
      ? newAddNode(mindMapData.rootNode.width / 2)
      : newAddNode(selectedNode.left)
    parentChildren.insertNodeToBottomOf(selectedNode.id, addedNode)

    mindMapData.updateAllPlacement(addedNode.id)

    return mindMapData
  }

  public deleteNode(mindMapData: MindMapData, selectedNode: MRootNode | MNode): MindMapData {
    if (mindMapData.rootNode.isSelected) {
      return mindMapData
    }

    const children = mindMapData.rightMap.children.recursively.findChildrenContainsId(
      selectedNode.id
    )
    if (!children) {
      throw newNotFoundChildrenErr(selectedNode.id)
    }

    const nextSelectedNode =
      children.nodes.length === 1
        ? mindMapData.findHeadNode(selectedNode.id)
        : children.findTopNodeOf(selectedNode.id)
    if (!nextSelectedNode) {
      throw newNotFoundNodeErr(selectedNode.id)
    }

    nextSelectedNode.isSelected = true
    mindMapData.rightMap.children.recursively.removeNodeById(selectedNode.id)

    if (nextSelectedNode.type === rootNodeType) {
      return mindMapData
    }

    mindMapData.rightMap.updateNodesVertical(nextSelectedNode)
    mindMapData.updateAccessoryPlacement()

    return mindMapData
  }
}

export default ShortcutUseCase
