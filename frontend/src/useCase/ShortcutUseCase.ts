import MMindMap from '~/domain/model/MMindMap'
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

  public handleKeydown(mindMap: MMindMap, key: Shortcut): MMindMap {
    const selectedNode = mindMap.findNodeIsSelected()
    if (!selectedNode) {
      return mindMap
    }

    // Sort in desc order of probability.
    switch (key) {
      case shortcuts.Tab:
        return this.addNodeToTail(mindMap, selectedNode)
      case shortcuts.Enter:
        return this.addNodeToBottom(mindMap, selectedNode)
      case shortcuts.Backspace:
        return this.deleteNode(mindMap, selectedNode)
      case shortcuts.MetaE:
        return this.nodeUseCase.enterEditMode(mindMap, selectedNode.id)
      case shortcuts.C:
        return this.checkboxUseCase.toggleHidden(mindMap, selectedNode.id)
      case shortcuts.T:
        return this.estimateTimeUseCase.enterEditMode(mindMap, selectedNode.id)
      case shortcuts.MetaEnter:
        return this.checkboxUseCase.toggleCheck(mindMap, selectedNode.id)
      case shortcuts.Space:
        return this.nodeUseCase.toggleCollapse(mindMap, selectedNode.id)
      case shortcuts.ShiftEnter: // Ignore
      case shortcuts.F6: // Ignore
        return mindMap
      default:
        assertNever(key, `Not defined key. key = ${key}`)
        return mindMap
    }
  }

  // Add node to tail of selected node in MindMap.
  // And select that node.
  // And update placement of all mind map parts.
  // Not add if selected node is collapsed.
  public addNodeToTail(mindMap: MMindMap, selectedNode: MRootNode | MNode): MMindMap {
    if (selectedNode.type !== rootNodeType && selectedNode.collapsed) {
      return mindMap
    }

    mindMap.deselectNode()

    const [addedNodeLeft, children] =
      selectedNode.type === rootNodeType
        ? [mindMap.rootNode.width / 2, mindMap.rightMap.children]
        : [selectedNode.left + selectedNode.width, selectedNode.children]
    // TODO Why set only left? There is top?
    const addedNode = newAddNode(addedNodeLeft)
    children.nodes.push(addedNode)

    mindMap.updateAllPlacement(addedNode.id)

    return mindMap
  }

  // Add node to bottom of selected node in MindMap.
  // And select that node.
  // And update placement of all mind map parts.
  // Not add if selected node is root node.
  public addNodeToBottom(mindMap: MMindMap, selectedNode: MRootNode | MNode): MMindMap {
    if (selectedNode.type === rootNodeType) {
      return mindMap
    }

    mindMap.deselectNode()

    const left = mindMap.isFirstLayerNode(selectedNode.id)
      ? mindMap.rootNode.width / 2
      : selectedNode.left
    const addedNode = selectedNode.content.checkbox.hidden
      ? newAddNode(left)
      : newAddNodeWithCheckbox(left)
    mindMap.rightMap.children.recursively
      .findChildrenContainsId(selectedNode.id)
      ?.insertNodeToBottomOf(selectedNode.id, addedNode)

    mindMap.updateAllPlacement(addedNode.id)

    return mindMap
  }

  // Delete node from MindMap.
  // And update placement of all mind map parts.
  // Cannot delete if selected node is root node.
  public deleteNode(mindMap: MMindMap, selectedNode: MRootNode | MNode): MMindMap {
    if (mindMap.rootNode.isSelected) {
      return mindMap
    }

    const children = mindMap.rightMap.children.recursively.findChildrenContainsId(selectedNode.id)
    if (!children) {
      throw newNotFoundChildrenErr(selectedNode.id)
    }

    const nextSelectedNode =
      children.nodes.length === 1
        ? mindMap.findHeadNode(selectedNode.id)
        : children.findTopNodeOf(selectedNode.id)
    if (!nextSelectedNode) {
      throw newNotFoundNodeErr(selectedNode.id)
    }

    nextSelectedNode.isSelected = true
    mindMap.rightMap.children.recursively.removeNodeById(selectedNode.id)

    if (nextSelectedNode.type === rootNodeType) {
      return mindMap
    }

    mindMap.rightMap.updateAllNodesVertical(nextSelectedNode)
    mindMap.updateAccessoryPlacement()

    return mindMap
  }
}

export default ShortcutUseCase
