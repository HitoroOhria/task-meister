import RootNodeData from "~/domain/model/RootNodeData";
import NodeData from "~/domain/model/NodeData";

describe("updateRightNodesDataTop", () => {
  test("Do noting when there are zero right nodes data", () => {
    const rootNodeData = new RootNodeData([], []);
    rootNodeData.updateRightNodesDataTop();
  });

  test("Top of right nodes data is set to half total height of right nodes data minus total height previous children when there are one or more right nodes data", () => {
    // Preparation
    const nodeData1 = new NodeData("nodeData1", []);
    const nodeData2 = new NodeData("nodeData2", []);
    const nodeData3 = new NodeData("nodeData3", []);
    nodeData1.nodeHeight = 100;
    nodeData2.nodeHeight = 200;
    nodeData3.nodeHeight = 300;

    // There is one child
    const oneRightNodeData = [nodeData1];
    const havingOneChildRootNodeData = new RootNodeData(oneRightNodeData, []);
    havingOneChildRootNodeData.updateRightNodeDataGroupHeight();
    havingOneChildRootNodeData.updateRightNodesDataTop();

    expect(havingOneChildRootNodeData.rightNodesData[0].top).toBe(-50);

    // There are two children
    const twoRightNodesData = [nodeData1, nodeData2];
    const havingTwoChildrenRootNodeData = new RootNodeData(
      twoRightNodesData,
      []
    );
    havingTwoChildrenRootNodeData.updateRightNodeDataGroupHeight();
    havingTwoChildrenRootNodeData.updateRightNodesDataTop();

    expect(havingTwoChildrenRootNodeData.rightNodesData[0].top).toBe(-150);
    expect(havingTwoChildrenRootNodeData.rightNodesData[1].top).toBe(-50);

    // There are three children
    const threeRightNodesData = [nodeData1, nodeData2, nodeData3];
    const havingThreeChildrenRootNodeData = new RootNodeData(
      threeRightNodesData,
      []
    );
    havingThreeChildrenRootNodeData.updateRightNodeDataGroupHeight();
    havingThreeChildrenRootNodeData.updateRightNodesDataTop();

    expect(havingThreeChildrenRootNodeData.rightNodesData[0].top).toBe(-300);
    expect(havingThreeChildrenRootNodeData.rightNodesData[1].top).toBe(-200);
    expect(havingThreeChildrenRootNodeData.rightNodesData[2].top).toBe(0);
  });
});
