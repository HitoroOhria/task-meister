import MMindMap from '~/domain/model/MMindMap'
import { newNotFoundNodeErr } from '~/util/ExceptionUtil'

// UseCase of Checkbox.
class CheckboxUseCase {
  // Toggle hidden of checkbox in MindMap.
  // And update placement of all mind map parts.
  // Not display checkbox if there is checkbox that already displayed in ancestor or children.
  public toggleHidden(mindMap: MMindMap, selectedNodeId: string): MMindMap {
    if (mindMap.rootNode.isSelected) {
      return mindMap
    }

    const selectedNode = mindMap.rightMap.children.recursively.findNodeById(selectedNodeId)
    if (!selectedNode) {
      throw newNotFoundNodeErr(selectedNode)
    }
    const cannotShowCheckbox =
      mindMap.hasDisplayedCheckboxAncestorNode(selectedNode.id) ||
      selectedNode.children.recursively.displayedCheckbox()
    if (cannotShowCheckbox) {
      return mindMap
    }

    selectedNode.content.checkbox.hidden = !selectedNode.content.checkbox.hidden
    if (selectedNode.content.checkbox.hidden) {
      selectedNode.content.checkbox.checked = false
    }

    mindMap.rightMap.children.recursively.updateEstimateTimeMinute()
    mindMap.updateAllPlacement(selectedNodeId)

    return mindMap
  }

  // Toggle check of checkbox in MindMap.
  public toggleCheck(mindMap: MMindMap, checkedNodeId: string): MMindMap {
    if (mindMap.rootNode.isSelected) {
      return mindMap
    }

    const checkedNode = mindMap.rightMap.children.recursively.findNodeById(checkedNodeId)
    if (!checkedNode) {
      throw newNotFoundNodeErr(checkedNode)
    }
    if (checkedNode.content.checkbox.hidden) {
      return mindMap
    }

    checkedNode.content.checkbox.checked = !checkedNode.content.checkbox.checked

    return mindMap
  }
}

export default CheckboxUseCase
