import NodeData from "~/domain/model/NodeData";

describe("updateGroupWidth", () => {
  test("GroupWidth is set to width of node when node does not have child", () => {
    const nodeData = new NodeData("id", []);
    nodeData.nodeWidth = 100;

    nodeData.updateGroupWidth();
    expect(nodeData.groupWidth).toBe(100);
  });

  test("GroupWidth is set to sum of itself and longest among children when there are one or more children", () => {
    const nodeData1 = new NodeData("id1", []);
    const nodeData2 = new NodeData("id2", []);
    const nodeData3 = new NodeData("id3", []);
    nodeData1.nodeWidth = 100;
    nodeData2.nodeWidth = 200;
    nodeData3.nodeWidth = 300;

    const sutNodeData = new NodeData("sut", [nodeData1, nodeData2, nodeData3]);
    sutNodeData.nodeWidth = 400;

    sutNodeData.updateGroupWidth();
    expect(sutNodeData.groupWidth).toBe(700);
  });

  test("GroupWidth is set to recursive sum of children when children are nested", () => {
    const noNestedNodeData1 = new NodeData("id1", []);
    const noNestedNodeData2 = new NodeData("id2", []);
    const noNestedNodeData3 = new NodeData("id3", []);
    const noNestedChildren = [
      noNestedNodeData1,
      noNestedNodeData2,
      noNestedNodeData3,
    ];

    // GroupWidth of oneNestedNodeData1 is 700
    noNestedNodeData1.nodeWidth = 100;
    noNestedNodeData2.nodeWidth = 200;
    noNestedNodeData3.nodeWidth = 300;
    const oneNestedNodeData1 = new NodeData("oneNestedId1", noNestedChildren);
    oneNestedNodeData1.nodeWidth = 400;

    // GroupWidth of oneNestedNodeData2 is 1500
    noNestedNodeData1.nodeWidth = 500;
    noNestedNodeData2.nodeWidth = 600;
    noNestedNodeData3.nodeWidth = 700;
    const oneNestedNodeData2 = new NodeData("oneNestedId2", noNestedChildren);
    oneNestedNodeData2.nodeWidth = 800;

    // GroupWidth of oneNestedNodeData3 is 2300
    noNestedNodeData1.nodeWidth = 900;
    noNestedNodeData2.nodeWidth = 1000;
    noNestedNodeData3.nodeWidth = 1100;
    const oneNestedNodeData3 = new NodeData("oneNestedId3", noNestedChildren);
    oneNestedNodeData3.nodeWidth = 1200;

    const oneNestedChildren = [
      oneNestedNodeData1,
      oneNestedNodeData2,
      oneNestedNodeData3,
    ];
    const sutTwoNestedNodeData = new NodeData("sut", oneNestedChildren);
    sutTwoNestedNodeData.nodeWidth = 1300;

    sutTwoNestedNodeData.updateGroupWidth();
    expect(sutTwoNestedNodeData.groupWidth).toBe(3600);
  });
});

describe("updateChildrenTop", () => {
  test("Do nothing when there are zero child", () => {
    const nodeData = new NodeData("id", []);
    nodeData.updateChildrenTop();

    expect(nodeData.top).toBe(0);
  });

  test("Top of child is set to top of node when there is one child", () => {
    const childNodeData = new NodeData("child", []);
    childNodeData.nodeHeight = 100;
    const parentNodeData = new NodeData("sut", [childNodeData]);
    parentNodeData.setTopFromRootNode(200);

    parentNodeData.updateChildrenTop();
    expect(parentNodeData.top).toBe(200);
    expect(parentNodeData.children[0].top).toBe(200);
  });

  test("Top of children is set to height of node minus total height of previous children when there are two or more children", () => {
    // Preparation
    const childNodeData1 = new NodeData("child1", []);
    const childNodeData2 = new NodeData("child2", []);
    const childNodeData3 = new NodeData("child3", []);
    childNodeData1.nodeHeight = 100;
    childNodeData2.nodeHeight = 200;
    childNodeData3.nodeHeight = 300;

    // There are two children
    const twoChildren = [childNodeData1, childNodeData2];
    const havingTwoChildrenNodeData = new NodeData(
      "havingTwoChildren",
      twoChildren
    );
    havingTwoChildrenNodeData.nodeHeight = 400;
    havingTwoChildrenNodeData.updateGroupHeight();
    havingTwoChildrenNodeData.setTopFromRootNode(500);
    havingTwoChildrenNodeData.updateChildrenTop();

    expect(havingTwoChildrenNodeData.top).toBe(500);
    expect(havingTwoChildrenNodeData.children[0].top).toBe(500);
    expect(havingTwoChildrenNodeData.children[1].top).toBe(600);

    // There are three children
    const threeChildren = [childNodeData1, childNodeData2, childNodeData3];
    const havingThreeChildrenNodeData = new NodeData(
      "havingThreeChildren",
      threeChildren
    );
    havingThreeChildrenNodeData.nodeHeight = 600;
    havingThreeChildrenNodeData.updateGroupHeight();
    havingThreeChildrenNodeData.setTopFromRootNode(-200);
    havingThreeChildrenNodeData.updateChildrenTop();

    expect(havingThreeChildrenNodeData.top).toBe(-200);
    expect(havingThreeChildrenNodeData.children[0].top).toBe(-200);
    expect(havingThreeChildrenNodeData.children[1].top).toBe(-100);
    expect(havingThreeChildrenNodeData.children[2].top).toBe(100);
  });
});
