import { newNodeData } from "~/domain/model/NodeData";
import { newGroup } from "~/domain/model/Group";

describe("findNodeDataById", () => {
  test("Return null when do not have children and id does not match that", () => {
    const nodeData = newNodeData("id", "", newGroup(), []);

    expect(nodeData.findNodeDataById("not-match")).toBe(null);
  });

  test("Return self when do not have children and id matches that", () => {
    const nodeData = newNodeData("id", "", newGroup(), []);

    expect(nodeData.findNodeDataById("id")).toBe(nodeData);
  });

  test("Return null when have children and id does not match that", () => {
    const nodeData = newNodeData("parent", "", newGroup(), []);

    nodeData.children.push(newNodeData("child1 of parent", "", newGroup(), []));
    nodeData.children[0].children.push(
      newNodeData("nested1 of child1", "", newGroup(), [])
    );
    nodeData.children[0].children.push(
      newNodeData("nested2 of child1", "", newGroup(), [])
    );

    nodeData.children.push(newNodeData("child2 of parent", "", newGroup(), []));
    nodeData.children[0].children.push(
      newNodeData("nested1 of child2", "", newGroup(), [])
    );
    nodeData.children[0].children.push(
      newNodeData("nested2 of child2", "", newGroup(), [])
    );

    expect(nodeData.findNodeDataById("not-match")).toBe(null);
  });

  test("Return self when have children and id matches self", () => {
    const nodeData = newNodeData("parent", "", newGroup(), []);

    nodeData.children.push(newNodeData("child1 of parent", "", newGroup(), []));
    nodeData.children[0].children.push(
      newNodeData("nested1 of child1", "", newGroup(), [])
    );
    nodeData.children[0].children.push(
      newNodeData("nested2 of child1", "", newGroup(), [])
    );

    nodeData.children.push(newNodeData("child2 of parent", "", newGroup(), []));
    nodeData.children[0].children.push(
      newNodeData("nested1 of child2", "", newGroup(), [])
    );
    nodeData.children[0].children.push(
      newNodeData("nested2 of child2", "", newGroup(), [])
    );

    expect(nodeData.findNodeDataById("parent")).toBe(nodeData);
  });

  test("Return NodeData matches id when have children and id matches that", () => {
    const nodeData = newNodeData("parent", "", newGroup(), []);

    nodeData.children.push(newNodeData("child1 of parent", "", newGroup(), []));
    nodeData.children[0].children.push(
      newNodeData("nested1 of child1", "", newGroup(), [])
    );
    nodeData.children[0].children.push(
      newNodeData("nested2 of child1", "", newGroup(), [])
    );

    // ↓ コレを返しちゃってる
    nodeData.children.push(newNodeData("child2 of parent", "", newGroup(), []));
    nodeData.children[1].children.push(
      newNodeData("nested1 of child2", "", newGroup(), [])
    );
    // ↓ ほしいのはコレ
    nodeData.children[1].children.push(
      newNodeData("nested2 of child2", "", newGroup(), [])
    );

    expect(nodeData.findNodeDataById("child1 of parent")).toBe(
      nodeData.children[0]
    );
    expect(nodeData.findNodeDataById("nested2 of child2")).toBe(
      nodeData.children[1].children[1]
    );
  });
});

describe("recursivelyUpdateGroupWidth", () => {
  test("GroupWidth is set to width of node when node does not have child", () => {
    const nodeData = newNodeData("id", "", newGroup(), []);
    nodeData.nodeWidth = 100;
    nodeData.children = [];

    nodeData.recursivelyUpdateGroupWidth();
    expect(nodeData.group.width).toBe(100);
  });

  test("GroupWidth is set to sum of itself and longest among children when there are one or more children", () => {
    // There is one child
    const nodeData1 = newNodeData("id1", "", newGroup(), []);
    nodeData1.nodeWidth = 100;

    nodeData1.children.push(newNodeData("child1", "", newGroup(), []));
    nodeData1.children[0].nodeWidth = 200;

    nodeData1.recursivelyUpdateGroupWidth();
    expect(nodeData1.group.width).toBe(300);
    expect(nodeData1.children[0].group.width).toBe(200);

    // There are three children
    const nodeData2 = newNodeData("id", "", newGroup(), []);
    nodeData2.nodeWidth = 100;

    nodeData2.children.push(newNodeData("child1", "", newGroup(), []));
    nodeData2.children.push(newNodeData("child2", "", newGroup(), []));
    nodeData2.children.push(newNodeData("child3", "", newGroup(), []));
    nodeData2.children[0].nodeWidth = 200;
    nodeData2.children[1].nodeWidth = 300;
    nodeData2.children[2].nodeWidth = 400;

    nodeData2.recursivelyUpdateGroupWidth();
    expect(nodeData2.group.width).toBe(500);
    expect(nodeData2.children[0].group.width).toBe(200);
    expect(nodeData2.children[1].group.width).toBe(300);
    expect(nodeData2.children[2].group.width).toBe(400);
  });

  test("GroupWidth is set to recursive sum of children when children are nested", () => {
    // As result of recursivelyUpdateGroupWidth, groupWidth of first child is 1100
    const nodeData = newNodeData("id", "", newGroup(), []);
    nodeData.nodeWidth = 100;

    // As result of recursivelyUpdateGroupWidth, groupWidth of first child is 700
    nodeData.children.push(newNodeData("child1", "", newGroup(), []));
    nodeData.children[0].nodeWidth = 200;
    nodeData.children[0].children.push(
      newNodeData("child1 of child1", "", newGroup(), [])
    );
    nodeData.children[0].children.push(
      newNodeData("child2 of child1", "", newGroup(), [])
    );
    nodeData.children[0].children[0].nodeWidth = 400;
    nodeData.children[0].children[1].nodeWidth = 500;

    // As result of recursivelyUpdateGroupWidth, groupWidth of second child is 10000
    nodeData.children.push(newNodeData("child2", "", newGroup(), []));
    nodeData.children[1].nodeWidth = 300;
    nodeData.children[1].children.push(
      newNodeData("child1 of child2", "", newGroup(), [])
    );
    nodeData.children[1].children.push(
      newNodeData("child2 of child2", "", newGroup(), [])
    );
    nodeData.children[1].children[0].nodeWidth = 600;
    nodeData.children[1].children[1].nodeWidth = 700;

    nodeData.recursivelyUpdateGroupWidth();
    expect(nodeData.group.width).toBe(1100);
    expect(nodeData.children[0].group.width).toBe(700);
    expect(nodeData.children[0].children[0].group.width).toBe(400);
    expect(nodeData.children[0].children[1].group.width).toBe(500);
    expect(nodeData.children[1].group.width).toBe(1000);
    expect(nodeData.children[1].children[0].group.width).toBe(600);
    expect(nodeData.children[1].children[1].group.width).toBe(700);
  });
});

describe("recursivelyUpdateGroupHeight", () => {
  test("GroupHeight is set to height of node when there is zero children", () => {
    const nodeData = newNodeData("id", "", newGroup(), []);
    nodeData.nodeHeight = 100;
    nodeData.children = [];

    nodeData.recursivelyUpdateGroupHeight();
    expect(nodeData.group.height).toBe(100);
  });

  test("GroupHeight is set to height of node or children when there are one or more children", () => {
    // GroupHeight is set to height of node When node is longer than children
    // GroupHeight is set to height of children When children are longer than node

    // There is one child
    const nodeData1 = newNodeData("id1", "", newGroup(), []);
    nodeData1.nodeHeight = 350;
    nodeData1.childrenHeight = 50;

    nodeData1.children.push(newNodeData("child1 of id1", "", newGroup(), []));
    nodeData1.children[0].nodeHeight = 300;
    nodeData1.children[0].childrenHeight = 0;

    nodeData1.recursivelyUpdateGroupHeight();
    expect(nodeData1.group.height).toBe(350);
    expect(nodeData1.children[0].group.height).toBe(300);

    // There are three children
    const nodeData2 = newNodeData("id2", "", newGroup(), []);
    nodeData2.nodeHeight = 400;
    nodeData2.childrenHeight = 750;

    nodeData2.children.push(newNodeData("child1 of id2", "", newGroup(), []));
    nodeData2.children[0].nodeHeight = 200;
    nodeData2.children[0].childrenHeight = 0;

    nodeData2.children.push(newNodeData("child2 of id2", "", newGroup(), []));
    nodeData2.children[1].nodeHeight = 300;
    nodeData2.children[1].childrenHeight = 0;

    nodeData2.children.push(newNodeData("child3 of id2", "", newGroup(), []));
    nodeData2.children[2].nodeHeight = 250;
    nodeData2.children[2].childrenHeight = 0;

    nodeData2.recursivelyUpdateGroupHeight();
    expect(nodeData2.group.height).toBe(750);
    expect(nodeData2.children[0].group.height).toBe(200);
    expect(nodeData2.children[1].group.height).toBe(300);
    expect(nodeData2.children[2].group.height).toBe(250);
  });

  test("GroupHeight is set to height of node or children when children is nested", () => {
    // GroupHeight is set to height of node When node is longer than children
    // GroupHeight is set to height of children When children are longer than node

    const nodeData = newNodeData("id", "", newGroup(), []);
    nodeData.nodeHeight = 100;
    nodeData.childrenHeight = 1700;

    // As result of recursivelyUpdateGroupWidth, groupHeight of first child is 400
    nodeData.children.push(newNodeData("child1", "", newGroup(), []));
    nodeData.children[0].nodeHeight = 400;
    nodeData.children[0].childrenHeight = 400;

    nodeData.children[0].children.push(
      newNodeData("child1 of child1", "", newGroup(), [])
    );
    nodeData.children[0].children[0].nodeHeight = 150;
    nodeData.children[0].children[0].childrenHeight = 0;

    nodeData.children[0].children.push(
      newNodeData("child2 of child1", "", newGroup(), [])
    );
    nodeData.children[0].children[1].nodeHeight = 250;
    nodeData.children[0].children[1].childrenHeight = 0;

    // As result of recursivelyUpdateGroupWidth, groupHeight of second child is 13000
    nodeData.children.push(newNodeData("child2", "", newGroup(), []));
    nodeData.children[1].nodeHeight = 300;
    nodeData.children[1].childrenHeight = 1300;

    nodeData.children[1].children.push(
      newNodeData("child1 of child2", "", newGroup(), [])
    );
    nodeData.children[1].children[0].nodeHeight = 600;
    nodeData.children[1].children[0].childrenHeight = 0;

    nodeData.children[1].children.push(
      newNodeData("child2 of child2", "", newGroup(), [])
    );
    nodeData.children[1].children[1].nodeHeight = 700;
    nodeData.children[1].children[1].childrenHeight = 0;

    nodeData.recursivelyUpdateGroupHeight();
    expect(nodeData.group.height).toBe(1700);
    expect(nodeData.children[0].group.height).toBe(400);
    expect(nodeData.children[0].children[0].group.height).toBe(150);
    expect(nodeData.children[0].children[1].group.height).toBe(250);
    expect(nodeData.children[1].group.height).toBe(1300);
    expect(nodeData.children[1].children[0].group.height).toBe(600);
    expect(nodeData.children[1].children[1].group.height).toBe(700);
  });
});

describe("recursivelyUpdateChildrenNodeTop", () => {
  test("Do nothing when there is zero child", () => {
    const nodeData = newNodeData("id1", "", newGroup(), []);
    nodeData.group.top = -300;
    nodeData.nodeHeight = 100;
    nodeData.childrenHeight = 0;
    nodeData.children = [];

    expect(nodeData.nodeTop).toBe(0);
  });

  test("NodeTop of children should be updated when there are one or more children", () => {
    // NodeTop of children is set to groupTop when height of children is longer than node
    // NodeTop of children is set to groupTop minus half different of node and children when height of node is longer than children

    // There is one child
    const nodeData1 = newNodeData("id1", "", newGroup(), []);
    nodeData1.group.top = -100;
    nodeData1.nodeHeight = 300;
    nodeData1.childrenHeight = 200;

    nodeData1.children.push(newNodeData("child1 of id1", "", newGroup(), []));
    nodeData1.children[0].group.height = 200;

    nodeData1.recursivelyUpdateChildrenNodeTop();
    expect(nodeData1.children[0].nodeTop).toBe(-50);

    // There are three children
    const nodeData2 = newNodeData("id2", "", newGroup(), []);
    nodeData2.group.top = -600;
    nodeData2.nodeHeight = 450;
    nodeData2.childrenHeight = 600;

    nodeData2.children.push(newNodeData("child1 of id2", "", newGroup(), []));
    nodeData2.children.push(newNodeData("child2 of id2", "", newGroup(), []));
    nodeData2.children.push(newNodeData("child3 of id2", "", newGroup(), []));
    nodeData2.children[0].group.height = 200;
    nodeData2.children[1].group.height = 100;
    nodeData2.children[2].group.height = 300;

    nodeData2.recursivelyUpdateChildrenNodeTop();
    expect(nodeData2.children[0].nodeTop).toBe(-600);
    expect(nodeData2.children[1].nodeTop).toBe(-400);
    expect(nodeData2.children[2].nodeTop).toBe(-300);
  });

  test("NodeTop of children should be updated when children is nested", () => {
    // NodeTop of children is set to groupTop when height of children is longer than node
    // NodeTop of children is set to groupTop minus half different of node and children when height of node is longer than children

    const nodeData = newNodeData("id", "", newGroup(), []);
    nodeData.group.top = -600;
    nodeData.nodeTop = 222;
    nodeData.nodeHeight = 500;
    nodeData.childrenHeight = 1700;

    // As result of recursivelyUpdateChildrenNodeTop, nodeTop of first child is -600
    nodeData.children.push(newNodeData("child1 of id", "", newGroup(), []));
    nodeData.children[0].group.top = -600;
    nodeData.children[0].nodeHeight = 450;
    nodeData.children[0].group.height = 450;
    nodeData.children[0].childrenHeight = 250;

    nodeData.children[0].children.push(
      newNodeData("nested1 of child1", "", newGroup(), [])
    );
    nodeData.children[0].children[0].group.top = -500;
    nodeData.children[0].children[0].nodeHeight = 200;
    nodeData.children[0].children[0].group.height = 200;
    nodeData.children[0].children[0].childrenHeight = 0;

    nodeData.children[0].children.push(
      newNodeData("nested2 of child1", "", newGroup(), [])
    );
    nodeData.children[0].children[1].group.top = -300;
    nodeData.children[0].children[1].nodeHeight = 50;
    nodeData.children[0].children[1].group.height = 50;
    nodeData.children[0].children[1].childrenHeight = 0;

    // As result of recursivelyUpdateChildrenNodeTop, nodeTop of first child is -360
    nodeData.children.push(newNodeData("child2 of id", "", newGroup(), []));
    nodeData.children[1].group.top = -250;
    nodeData.children[1].nodeHeight = 600;
    nodeData.children[1].group.height = 1450;
    nodeData.children[1].childrenHeight = 1450;

    nodeData.children[1].children.push(
      newNodeData("nested1 of child2", "", newGroup(), [])
    );
    nodeData.children[1].children[0].group.top = -250;
    nodeData.children[1].children[0].nodeHeight = 1000;
    nodeData.children[1].children[0].group.height = 1000;
    nodeData.children[1].children[0].childrenHeight = 0;

    nodeData.children[1].children.push(
      newNodeData("nested2 of child2", "", newGroup(), [])
    );
    nodeData.children[1].children[1].group.top = 750;
    nodeData.children[1].children[1].nodeHeight = 450;
    nodeData.children[1].children[1].group.height = 450;
    nodeData.children[1].children[1].childrenHeight = 0;

    nodeData.recursivelyUpdateChildrenNodeTop();
    expect(nodeData.nodeTop).toBe(222);
    expect(nodeData.children[0].nodeTop).toBe(-600);
    expect(nodeData.children[0].children[0].nodeTop).toBe(-500);
    expect(nodeData.children[0].children[1].nodeTop).toBe(-300);
    expect(nodeData.children[1].nodeTop).toBe(-150);
    expect(nodeData.children[1].children[0].nodeTop).toBe(-250);
    expect(nodeData.children[1].children[1].nodeTop).toBe(750);
  });
});
