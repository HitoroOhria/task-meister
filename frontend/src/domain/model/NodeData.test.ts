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
