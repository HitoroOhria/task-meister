import MindMapData from '~/domain/model/MindMapData'
import { newNotFoundNodeErr } from '~/util/ExceptionUtil'

// UseCase of Checkbox.
class CheckboxUseCase {
  // Toggle checkbox hidden.
  // And update placement of all mind map parts.
  // Not display checkbox if there is checkbox that already displayed in ancestor or children.
  public toggleHidden(mindMapData: MindMapData, selectedNodeId: string): MindMapData {
    if (mindMapData.rootNode.isSelected) {
      return mindMapData
    }

    const selectedNode = mindMapData.rightMap.children.recursively.findNodeById(selectedNodeId)
    if (!selectedNode) {
      throw newNotFoundNodeErr(selectedNode)
    }
    const cannotShowCheckbox =
      mindMapData.hasDisplayedCheckboxAncestorNode(selectedNode.id) ||
      selectedNode.children.recursively.displayedCheckbox()
    if (cannotShowCheckbox) {
      return mindMapData
    }

    selectedNode.checkbox.hidden = !selectedNode.checkbox.hidden
    if (selectedNode.checkbox.hidden) {
      selectedNode.checkbox.checked = false
    }

    mindMapData.updateAllPlacement(selectedNodeId)

    return mindMapData
  }

  // Toggle check.
  public toggleCheck(mindMapData: MindMapData, checkedNodeId: string): MindMapData {
    if (mindMapData.rootNode.isSelected) {
      return mindMapData
    }

    const checkedNode = mindMapData.rightMap.children.recursively.findNodeById(checkedNodeId)
    if (!checkedNode) {
      throw newNotFoundNodeErr(checkedNode)
    }
    if (checkedNode.checkbox.hidden) {
      return mindMapData
    }

    checkedNode.checkbox.checked = !checkedNode.checkbox.checked

    return mindMapData
  }
}

export default CheckboxUseCase
