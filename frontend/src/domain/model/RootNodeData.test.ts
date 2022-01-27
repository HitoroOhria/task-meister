export {}

test("dummy", () => {
  expect(1).toBe(1);
})

// import NodeData from "~/domain/model/NodeData";
//
// describe("updateRightNodesDataTop", () => {
//   test("Do noting when there are zero right nodes data", () => {
//     const mindMapData = new MindMapData([], []);
//     mindMapData.updateRightNodesDataTop();
//   });
//
//   test("Top of right nodes data is set to half total height of right nodes data minus total height previous children when there are one or more right nodes data", () => {
//     // Preparation
//     const nodeData1 = new NodeData("nodeData1", []);
//     const nodeData2 = new NodeData("nodeData2", []);
//     const nodeData3 = new NodeData("nodeData3", []);
//     nodeData1.nodeHeight = 100;
//     nodeData2.nodeHeight = 200;
//     nodeData3.nodeHeight = 300;
//
//     // There is one child
//     const oneRightNodeData = [nodeData1];
//     const havingOneChildmindMapData = new MindMapData(oneRightNodeData, []);
//     havingOneChildmindMapData.updateRightNodeDataGroupHeight();
//     havingOneChildmindMapData.updateRightNodesDataTop();
//
//     expect(havingOneChildmindMapData.rightNodesData[0].top).toBe(-50);
//
//     // There are two children
//     const twoRightNodesData = [nodeData1, nodeData2];
//     const havingTwoChildrenmindMapData = new MindMapData(
//       twoRightNodesData,
//       []
//     );
//     havingTwoChildrenmindMapData.updateRightNodeDataGroupHeight();
//     havingTwoChildrenmindMapData.updateRightNodesDataTop();
//
//     expect(havingTwoChildrenmindMapData.rightNodesData[0].top).toBe(-150);
//     expect(havingTwoChildrenmindMapData.rightNodesData[1].top).toBe(-50);
//
//     // There are three children
//     const threeRightNodesData = [nodeData1, nodeData2, nodeData3];
//     const havingThreeChildrenmindMapData = new MindMapData(
//       threeRightNodesData,
//       []
//     );
//     havingThreeChildrenmindMapData.updateRightNodeDataGroupHeight();
//     havingThreeChildrenmindMapData.updateRightNodesDataTop();
//
//     expect(havingThreeChildrenmindMapData.rightNodesData[0].top).toBe(-300);
//     expect(havingThreeChildrenmindMapData.rightNodesData[1].top).toBe(-200);
//     expect(havingThreeChildrenmindMapData.rightNodesData[2].top).toBe(0);
//   });
// });
