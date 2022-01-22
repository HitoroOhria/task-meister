import { newNodeData } from "~/domain/model/NodeData";

describe("findNodeDataById", () => {
  test("Return null when do not have children and id does not match that", () => {
    const nodeData = newNodeData("id", "", []);

    expect(nodeData.findNodeDataById("not-match")).toBe(null);
  });

  test("Return self when do not have children and id matches that", () => {
    const nodeData = newNodeData("id", "", []);

    expect(nodeData.findNodeDataById("id")).toBe(nodeData);
  });

  test("Return null when have children and id does not match that", () => {
    const nodeData = newNodeData("parent", "", []);

    nodeData.children.push(newNodeData("child1 of parent", "", []));
    nodeData.children[0].children.push(
      newNodeData("nested1 of child1", "", [])
    );
    nodeData.children[0].children.push(
      newNodeData("nested2 of child1", "", [])
    );

    nodeData.children.push(newNodeData("child2 of parent", "", []));
    nodeData.children[0].children.push(
      newNodeData("nested1 of child2", "", [])
    );
    nodeData.children[0].children.push(
      newNodeData("nested2 of child2", "", [])
    );

    expect(nodeData.findNodeDataById("not-match")).toBe(null);
  });

  test("Return self when have children and id matches self", () => {
    const nodeData = newNodeData("parent", "", []);

    nodeData.children.push(newNodeData("child1 of parent", "", []));
    nodeData.children[0].children.push(
      newNodeData("nested1 of child1", "", [])
    );
    nodeData.children[0].children.push(
      newNodeData("nested2 of child1", "", [])
    );

    nodeData.children.push(newNodeData("child2 of parent", "", []));
    nodeData.children[0].children.push(
      newNodeData("nested1 of child2", "", [])
    );
    nodeData.children[0].children.push(
      newNodeData("nested2 of child2", "", [])
    );

    expect(nodeData.findNodeDataById("parent")).toBe(nodeData);
  });

  test("Return NodeData matches id when have children and id matches that", () => {
    const nodeData = newNodeData("parent", "", []);

    nodeData.children.push(newNodeData("child1 of parent", "", []));
    nodeData.children[0].children.push(
      newNodeData("nested1 of child1", "", [])
    );
    nodeData.children[0].children.push(
      newNodeData("nested2 of child1", "", [])
    );

    // ↓ コレを返しちゃってる
    nodeData.children.push(newNodeData("child2 of parent", "", []));
    nodeData.children[1].children.push(
      newNodeData("nested1 of child2", "", [])
    );
    // ↓ ほしいのはコレ
    nodeData.children[1].children.push(
      newNodeData("nested2 of child2", "", [])
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
    const nodeData = newNodeData("id", "", []);
    nodeData.nodeWidth = 100;
    nodeData.children = [];

    nodeData.recursivelyUpdateGroupWidth();
    expect(nodeData.groupWidth).toBe(100);
  });

  test("GroupWidth is set to sum of itself and longest among children when there are one or more children", () => {
    // There is one child
    const nodeData1 = newNodeData("id1", "", []);
    nodeData1.nodeWidth = 100;

    nodeData1.children.push(newNodeData("child1", "", []));
    nodeData1.children[0].nodeWidth = 200;

    nodeData1.recursivelyUpdateGroupWidth();
    expect(nodeData1.groupWidth).toBe(300);
    expect(nodeData1.children[0].groupWidth).toBe(200);

    // There are three children
    const nodeData2 = newNodeData("id", "", []);
    nodeData2.nodeWidth = 100;

    nodeData2.children.push(newNodeData("child1", "", []));
    nodeData2.children.push(newNodeData("child2", "", []));
    nodeData2.children.push(newNodeData("child3", "", []));
    nodeData2.children[0].nodeWidth = 200;
    nodeData2.children[1].nodeWidth = 300;
    nodeData2.children[2].nodeWidth = 400;

    nodeData2.recursivelyUpdateGroupWidth();
    expect(nodeData2.groupWidth).toBe(500);
    expect(nodeData2.children[0].groupWidth).toBe(200);
    expect(nodeData2.children[1].groupWidth).toBe(300);
    expect(nodeData2.children[2].groupWidth).toBe(400);
  });

  test("GroupWidth is set to recursive sum of children when children are nested", () => {
    // As result of recursivelyUpdateGroupWidth, groupWidth of first child is 1100
    const nodeData = newNodeData("id", "", []);
    nodeData.nodeWidth = 100;

    // As result of recursivelyUpdateGroupWidth, groupWidth of first child is 700
    nodeData.children.push(newNodeData("child1", "", []));
    nodeData.children[0].nodeWidth = 200;
    nodeData.children[0].children.push(newNodeData("child1 of child1", "", []));
    nodeData.children[0].children.push(newNodeData("child2 of child1", "", []));
    nodeData.children[0].children[0].nodeWidth = 400;
    nodeData.children[0].children[1].nodeWidth = 500;

    // As result of recursivelyUpdateGroupWidth, groupWidth of second child is 10000
    nodeData.children.push(newNodeData("child2", "", []));
    nodeData.children[1].nodeWidth = 300;
    nodeData.children[1].children.push(newNodeData("child1 of child2", "", []));
    nodeData.children[1].children.push(newNodeData("child2 of child2", "", []));
    nodeData.children[1].children[0].nodeWidth = 600;
    nodeData.children[1].children[1].nodeWidth = 700;

    nodeData.recursivelyUpdateGroupWidth();
    expect(nodeData.groupWidth).toBe(1100);
    expect(nodeData.children[0].groupWidth).toBe(700);
    expect(nodeData.children[0].children[0].groupWidth).toBe(400);
    expect(nodeData.children[0].children[1].groupWidth).toBe(500);
    expect(nodeData.children[1].groupWidth).toBe(1000);
    expect(nodeData.children[1].children[0].groupWidth).toBe(600);
    expect(nodeData.children[1].children[1].groupWidth).toBe(700);
  });
});

describe("recursivelyUpdateGroupHeight", () => {
  test("GroupHeight is set to height of node when there is zero children", () => {
    const nodeData = newNodeData("id", "", []);
    nodeData.nodeHeight = 100;
    nodeData.children = [];

    nodeData.recursivelyUpdateGroupHeight();
    expect(nodeData.groupHeight).toBe(100);
  });

  test("GroupHeight is set to height of node or children when there are one or more children", () => {
    // GroupHeight is set to height of node When node is longer than children
    // GroupHeight is set to height of children When children are longer than node

    // There is one child
    const nodeData1 = newNodeData("id1", "", []);
    nodeData1.nodeHeight = 350;
    nodeData1.childrenHeight = 50;

    nodeData1.children.push(newNodeData("child1 of id1", "", []));
    nodeData1.children[0].nodeHeight = 300;
    nodeData1.children[0].childrenHeight = 0;

    nodeData1.recursivelyUpdateGroupHeight();
    expect(nodeData1.groupHeight).toBe(350);
    expect(nodeData1.children[0].groupHeight).toBe(300);

    // There are three children
    const nodeData2 = newNodeData("id2", "", []);
    nodeData2.nodeHeight = 400;
    nodeData2.childrenHeight = 750;

    nodeData2.children.push(newNodeData("child1 of id2", "", []));
    nodeData2.children[0].nodeHeight = 200;
    nodeData2.children[0].childrenHeight = 0;

    nodeData2.children.push(newNodeData("child2 of id2", "", []));
    nodeData2.children[1].nodeHeight = 300;
    nodeData2.children[1].childrenHeight = 0;

    nodeData2.children.push(newNodeData("child3 of id2", "", []));
    nodeData2.children[2].nodeHeight = 250;
    nodeData2.children[2].childrenHeight = 0;

    nodeData2.recursivelyUpdateGroupHeight();
    expect(nodeData2.groupHeight).toBe(750);
    expect(nodeData2.children[0].groupHeight).toBe(200);
    expect(nodeData2.children[1].groupHeight).toBe(300);
    expect(nodeData2.children[2].groupHeight).toBe(250);
  });

  test("GroupHeight is set to height of node or children when children is nested", () => {
    // GroupHeight is set to height of node When node is longer than children
    // GroupHeight is set to height of children When children are longer than node

    const nodeData = newNodeData("id", "", []);
    nodeData.nodeHeight = 100;
    nodeData.childrenHeight = 1700;

    // As result of recursivelyUpdateGroupWidth, groupHeight of first child is 400
    nodeData.children.push(newNodeData("child1", "", []));
    nodeData.children[0].nodeHeight = 400;
    nodeData.children[0].childrenHeight = 400;

    nodeData.children[0].children.push(newNodeData("child1 of child1", "", []));
    nodeData.children[0].children[0].nodeHeight = 150;
    nodeData.children[0].children[0].childrenHeight = 0;

    nodeData.children[0].children.push(newNodeData("child2 of child1", "", []));
    nodeData.children[0].children[1].nodeHeight = 250;
    nodeData.children[0].children[1].childrenHeight = 0;

    // As result of recursivelyUpdateGroupWidth, groupHeight of second child is 13000
    nodeData.children.push(newNodeData("child2", "", []));
    nodeData.children[1].nodeHeight = 300;
    nodeData.children[1].childrenHeight = 1300;

    nodeData.children[1].children.push(newNodeData("child1 of child2", "", []));
    nodeData.children[1].children[0].nodeHeight = 600;
    nodeData.children[1].children[0].childrenHeight = 0;

    nodeData.children[1].children.push(newNodeData("child2 of child2", "", []));
    nodeData.children[1].children[1].nodeHeight = 700;
    nodeData.children[1].children[1].childrenHeight = 0;

    nodeData.recursivelyUpdateGroupHeight();
    expect(nodeData.groupHeight).toBe(1700);
    expect(nodeData.children[0].groupHeight).toBe(400);
    expect(nodeData.children[0].children[0].groupHeight).toBe(150);
    expect(nodeData.children[0].children[1].groupHeight).toBe(250);
    expect(nodeData.children[1].groupHeight).toBe(1300);
    expect(nodeData.children[1].children[0].groupHeight).toBe(600);
    expect(nodeData.children[1].children[1].groupHeight).toBe(700);
  });
});

describe("recursivelyUpdateChildrenNodeTop", () => {
  test("Do nothing when there is zero child", () => {
    const nodeData = newNodeData("id1", "", []);
    nodeData.groupTop = -300;
    nodeData.nodeHeight = 100;
    nodeData.childrenHeight = 0;
    nodeData.children = [];

    expect(nodeData.nodeTop).toBe(0);
  });

  test("NodeTop of children should be updated when there are one or more children", () => {
    // NodeTop of children is set to groupTop when height of children is longer than node
    // NodeTop of children is set to groupTop minus half different of node and children when height of node is longer than children

    // There is one child
    const nodeData1 = newNodeData("id1", "", []);
    nodeData1.groupTop = -100;
    nodeData1.nodeHeight = 300;
    nodeData1.childrenHeight = 200;

    nodeData1.children.push(newNodeData("child1 of id1", "", []));
    nodeData1.children[0].groupHeight = 200;

    nodeData1.recursivelyUpdateChildrenNodeTop();
    expect(nodeData1.children[0].nodeTop).toBe(-50);

    // There are three children
    const nodeData2 = newNodeData("id2", "", []);
    nodeData2.groupTop = -600;
    nodeData2.nodeHeight = 450;
    nodeData2.childrenHeight = 600;

    nodeData2.children.push(newNodeData("child1 of id2", "", []));
    nodeData2.children.push(newNodeData("child2 of id2", "", []));
    nodeData2.children.push(newNodeData("child3 of id2", "", []));
    nodeData2.children[0].groupHeight = 200;
    nodeData2.children[1].groupHeight = 100;
    nodeData2.children[2].groupHeight = 300;

    nodeData2.recursivelyUpdateChildrenNodeTop();
    expect(nodeData2.children[0].nodeTop).toBe(-600);
    expect(nodeData2.children[1].nodeTop).toBe(-400);
    expect(nodeData2.children[2].nodeTop).toBe(-300);
  });

  test("NodeTop of children should be updated when children is nested", () => {
    // NodeTop of children is set to groupTop when height of children is longer than node
    // NodeTop of children is set to groupTop minus half different of node and children when height of node is longer than children

    const nodeData = newNodeData("id", "", []);
    nodeData.groupTop = -600;
    nodeData.nodeTop = 222;
    nodeData.nodeHeight = 500;
    nodeData.childrenHeight = 1700;

    // As result of recursivelyUpdateChildrenNodeTop, nodeTop of first child is -600
    nodeData.children.push(newNodeData("child1 of id", "", []));
    nodeData.children[0].groupTop = -600;
    nodeData.children[0].nodeHeight = 450;
    nodeData.children[0].groupHeight = 450;
    nodeData.children[0].childrenHeight = 250;

    nodeData.children[0].children.push(newNodeData("nested1 of child1", "", []));
    nodeData.children[0].children[0].groupTop = -500;
    nodeData.children[0].children[0].nodeHeight = 200;
    nodeData.children[0].children[0].groupHeight = 200;
    nodeData.children[0].children[0].childrenHeight = 0;

    nodeData.children[0].children.push(newNodeData("nested2 of child1", "", []));
    nodeData.children[0].children[1].groupTop = -300;
    nodeData.children[0].children[1].nodeHeight = 50;
    nodeData.children[0].children[1].groupHeight = 50;
    nodeData.children[0].children[1].childrenHeight = 0;

    // As result of recursivelyUpdateChildrenNodeTop, nodeTop of first child is -360
    nodeData.children.push(newNodeData("child2 of id", "", []));
    nodeData.children[1].groupTop = -250;
    nodeData.children[1].nodeHeight = 600;
    nodeData.children[1].groupHeight = 1450;
    nodeData.children[1].childrenHeight = 1450;

    nodeData.children[1].children.push(newNodeData("nested1 of child2", "", []));
    nodeData.children[1].children[0].groupTop = -250;
    nodeData.children[1].children[0].nodeHeight = 1000;
    nodeData.children[1].children[0].groupHeight = 1000;
    nodeData.children[1].children[0].childrenHeight = 0;

    nodeData.children[1].children.push(newNodeData("nested2 of child2", "", []));
    nodeData.children[1].children[1].groupTop = 750;
    nodeData.children[1].children[1].nodeHeight = 450;
    nodeData.children[1].children[1].groupHeight = 450;
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
