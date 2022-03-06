import MindMapData from '~/domain/model/MindMapData'
import MRootNode, { rootNodeType } from '~/domain/model/MRootNode'
import MNode, { newAddNode, newAddNodeWithCheckbox } from '~/domain/model/MNode'

import ArrowKeyUseCase from '~/useCase/ArrowKeyUseCase'
import MindMapUseCase from '~/useCase/MindMapUseCase'
import NodeUseCase from '~/useCase/NodeUseCase'
import CheckboxUseCase from '~/useCase/CheckboxUseCase'
import EstimateTimeUseCase from '~/useCase/EstimateTimeUseCase'

import Shortcut, { shortcuts } from '~/enum/Shortcut'

import { assertNever, newNotFoundChildrenErr, newNotFoundNodeErr } from '~/util/ExceptionUtil'

// UseCase of shortcut.
class ShortcutUseCase {
  private mindMapUseCase: MindMapUseCase
  private arrowKeyUseCase: ArrowKeyUseCase
  private nodeUseCase: NodeUseCase
  private checkboxUseCase: CheckboxUseCase
  private estimateTimeUseCase: EstimateTimeUseCase

  constructor(
    mindMapUseCase: MindMapUseCase,
    arrowKeyUseCase: ArrowKeyUseCase,
    nodeUseCase: NodeUseCase,
    checkboxUseCase: CheckboxUseCase,
    estimateTimeUseCase: EstimateTimeUseCase
  ) {
    this.mindMapUseCase = mindMapUseCase
    this.arrowKeyUseCase = arrowKeyUseCase
    this.nodeUseCase = nodeUseCase
    this.checkboxUseCase = checkboxUseCase
    this.estimateTimeUseCase = estimateTimeUseCase
  }

  public handleKeydown(mindMapData: MindMapData, key: Shortcut): MindMapData {
    const selectedNode = mindMapData.findNodeIsSelected()
    if (!selectedNode) {
      return mindMapData
    }

    // Sort in desc order of probability.
    switch (key) {
      case shortcuts.Tab:
        return this.addNodeToTail(mindMapData, selectedNode)
      case shortcuts.Enter:
        return this.addNodeToBottom(mindMapData, selectedNode)
      case shortcuts.Backspace:
        return this.deleteNode(mindMapData, selectedNode)
      case shortcuts.MetaE:
        return this.nodeUseCase.enterEditMode(mindMapData, selectedNode.id)
      case shortcuts.C:
        return this.checkboxUseCase.toggleHidden(mindMapData, selectedNode.id)
      case shortcuts.T:
        return this.estimateTimeUseCase.enterEditMode(mindMapData, selectedNode.id)
      case shortcuts.MetaEnter:
        return this.checkboxUseCase.toggleCheck(mindMapData, selectedNode.id)
      case shortcuts.Space:
        return this.nodeUseCase.toggleCollapse(mindMapData, selectedNode.id)
      case shortcuts.ShiftEnter: // Ignore
      case shortcuts.F6: // Ignore
        return mindMapData
      default:
        assertNever(key, `Not defined key. key = ${key}`)
        return mindMapData
    }
  }

  // Add node to tail of selected node in MindMap.
  // And select that node.
  // And update placement of all mind map parts.
  // Not add if selected node is collapsed.
  public addNodeToTail(mindMapData: MindMapData, selectedNode: MRootNode | MNode): MindMapData {
    if (selectedNode.type !== rootNodeType && selectedNode.collapsed) {
      return mindMapData
    }

    mindMapData.deselectNode()

    const [addedNodeLeft, children] =
      selectedNode.type === rootNodeType
        ? [mindMapData.rootNode.width / 2, mindMapData.rightMap.children]
        : [selectedNode.left + selectedNode.width, selectedNode.children]
    // TODO Why set only left? There is top?
    const addedNode = newAddNode(addedNodeLeft)
    children.nodes.push(addedNode)

    mindMapData.updateAllPlacement(addedNode.id)

    return mindMapData
  }

  // Add node to bottom of selected node in MindMap.
  // And select that node.
  // And update placement of all mind map parts.
  // Not add if selected node is root node.
  public addNodeToBottom(mindMapData: MindMapData, selectedNode: MRootNode | MNode): MindMapData {
    if (selectedNode.type === rootNodeType) {
      return mindMapData
    }

    mindMapData.deselectNode()

    const left = mindMapData.isFirstLayerNode(selectedNode.id)
      ? mindMapData.rootNode.width / 2
      : selectedNode.left
    const addedNode = selectedNode.checkbox.hidden ? newAddNode(left) : newAddNodeWithCheckbox(left)
    mindMapData.rightMap.children.recursively
      .findChildrenContainsId(selectedNode.id)
      ?.insertNodeToBottomOf(selectedNode.id, addedNode)

    mindMapData.updateAllPlacement(addedNode.id)

    return mindMapData
  }

  // Delete node from MindMap.
  // And update placement of all mind map parts.
  // Cannot delete if selected node is root node.
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
