import { newNodeData } from "~/domain/model/NodeData";
import { newGroup } from "~/domain/model/Group";
import { newChildren } from "~/domain/model/Children";

describe("findNodeDataById", () => {
  test("Return null when do not have children and id does not match that", () => {
    const nodeData = newNodeData("id", "", newGroup(), newChildren([]));

    expect(nodeData.findNodeDataById("not-match")).toBe(null);
  });

  test("Return self when do not have children and id matches that", () => {
    const nodeData = newNodeData("id", "", newGroup(), newChildren([]));

    expect(nodeData.findNodeDataById("id")).toBe(nodeData);
  });

  test("Return null when have children and id does not match that", () => {
    const nodeData = newNodeData("parent", "", newGroup(), newChildren([]));

    nodeData.children.list.push(
      newNodeData("child1 of parent", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[0].children.list.push(
      newNodeData("nested1 of child1", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[0].children.list.push(
      newNodeData("nested2 of child1", "", newGroup(), newChildren([]))
    );

    nodeData.children.list.push(
      newNodeData("child2 of parent", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[0].children.list.push(
      newNodeData("nested1 of child2", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[0].children.list.push(
      newNodeData("nested2 of child2", "", newGroup(), newChildren([]))
    );

    expect(nodeData.findNodeDataById("not-match")).toBe(null);
  });

  test("Return self when have children and id matches self", () => {
    const nodeData = newNodeData("parent", "", newGroup(), newChildren([]));

    nodeData.children.list.push(
      newNodeData("child1 of parent", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[0].children.list.push(
      newNodeData("nested1 of child1", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[0].children.list.push(
      newNodeData("nested2 of child1", "", newGroup(), newChildren([]))
    );

    nodeData.children.list.push(
      newNodeData("child2 of parent", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[0].children.list.push(
      newNodeData("nested1 of child2", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[0].children.list.push(
      newNodeData("nested2 of child2", "", newGroup(), newChildren([]))
    );

    expect(nodeData.findNodeDataById("parent")).toBe(nodeData);
  });

  test("Return NodeData matches id when have children and id matches that", () => {
    const nodeData = newNodeData("parent", "", newGroup(), newChildren([]));

    nodeData.children.list.push(
      newNodeData("child1 of parent", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[0].children.list.push(
      newNodeData("nested1 of child1", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[0].children.list.push(
      newNodeData("nested2 of child1", "", newGroup(), newChildren([]))
    );

    // ↓ コレを返しちゃってる
    nodeData.children.list.push(
      newNodeData("child2 of parent", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[1].children.list.push(
      newNodeData("nested1 of child2", "", newGroup(), newChildren([]))
    );
    // ↓ ほしいのはコレ
    nodeData.children.list[1].children.list.push(
      newNodeData("nested2 of child2", "", newGroup(), newChildren([]))
    );

    expect(nodeData.findNodeDataById("child1 of parent")).toBe(
      nodeData.children.list[0]
    );
    expect(nodeData.findNodeDataById("nested2 of child2")).toBe(
      nodeData.children.list[1].children.list[1]
    );
  });
});

describe("recursivelyUpdateGroupWidth", () => {
  test("GroupWidth is set to width of node when node does not have child", () => {
    const nodeData = newNodeData("id", "", newGroup(), newChildren([]));
    nodeData.width = 100;
    nodeData.children = newChildren([]);

    nodeData.recursivelyUpdateGroupWidth();
    expect(nodeData.group.width).toBe(100);
  });

  test("GroupWidth is set to sum of itself and longest among children when there are one or more children", () => {
    // There is one child
    const nodeData1 = newNodeData("id1", "", newGroup(), newChildren([]));
    nodeData1.width = 100;

    nodeData1.children.list.push(
      newNodeData("child1", "", newGroup(), newChildren([]))
    );
    nodeData1.children.list[0].width = 200;

    nodeData1.recursivelyUpdateGroupWidth();
    expect(nodeData1.group.width).toBe(300);
    expect(nodeData1.children.list[0].group.width).toBe(200);

    // There are three children
    const nodeData2 = newNodeData("id", "", newGroup(), newChildren([]));
    nodeData2.width = 100;

    nodeData2.children.list.push(
      newNodeData("child1", "", newGroup(), newChildren([]))
    );
    nodeData2.children.list.push(
      newNodeData("child2", "", newGroup(), newChildren([]))
    );
    nodeData2.children.list.push(
      newNodeData("child3", "", newGroup(), newChildren([]))
    );
    nodeData2.children.list[0].width = 200;
    nodeData2.children.list[1].width = 300;
    nodeData2.children.list[2].width = 400;

    nodeData2.recursivelyUpdateGroupWidth();
    expect(nodeData2.group.width).toBe(500);
    expect(nodeData2.children.list[0].group.width).toBe(200);
    expect(nodeData2.children.list[1].group.width).toBe(300);
    expect(nodeData2.children.list[2].group.width).toBe(400);
  });

  test("GroupWidth is set to recursive sum of children when children are nested", () => {
    // As result of recursivelyUpdateGroupWidth, groupWidth of first child is 1100
    const nodeData = newNodeData("id", "", newGroup(), newChildren([]));
    nodeData.width = 100;

    // As result of recursivelyUpdateGroupWidth, groupWidth of first child is 700
    nodeData.children.list.push(
      newNodeData("child1", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[0].width = 200;
    nodeData.children.list[0].children.list.push(
      newNodeData("child1 of child1", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[0].children.list.push(
      newNodeData("child2 of child1", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[0].children.list[0].width = 400;
    nodeData.children.list[0].children.list[1].width = 500;

    // As result of recursivelyUpdateGroupWidth, groupWidth of second child is 10000
    nodeData.children.list.push(
      newNodeData("child2", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[1].width = 300;
    nodeData.children.list[1].children.list.push(
      newNodeData("child1 of child2", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[1].children.list.push(
      newNodeData("child2 of child2", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[1].children.list[0].width = 600;
    nodeData.children.list[1].children.list[1].width = 700;

    nodeData.recursivelyUpdateGroupWidth();
    expect(nodeData.group.width).toBe(1100);
    expect(nodeData.children.list[0].group.width).toBe(700);
    expect(nodeData.children.list[0].children.list[0].group.width).toBe(400);
    expect(nodeData.children.list[0].children.list[1].group.width).toBe(500);
    expect(nodeData.children.list[1].group.width).toBe(1000);
    expect(nodeData.children.list[1].children.list[0].group.width).toBe(600);
    expect(nodeData.children.list[1].children.list[1].group.width).toBe(700);
  });
});

describe("recursivelyUpdateGroupHeight", () => {
  test("GroupHeight is set to height of node when there is zero children", () => {
    const nodeData = newNodeData("id", "", newGroup(), newChildren([]));
    nodeData.height = 100;
    nodeData.children = newChildren([]);

    nodeData.recursivelyUpdateGroupHeight();
    expect(nodeData.group.height).toBe(100);
  });

  test("GroupHeight is set to height of node or children when there are one or more children", () => {
    // GroupHeight is set to height of node When node is longer than children
    // GroupHeight is set to height of children When children are longer than node

    // There is one child
    const nodeData1 = newNodeData("id1", "", newGroup(), newChildren([]));
    nodeData1.height = 350;
    nodeData1.children.height = 50;

    nodeData1.children.list.push(
      newNodeData("child1 of id1", "", newGroup(), newChildren([]))
    );
    nodeData1.children.list[0].height = 300;
    nodeData1.children.list[0].children.height = 0;

    nodeData1.recursivelyUpdateGroupHeight();
    expect(nodeData1.group.height).toBe(350);
    expect(nodeData1.children.list[0].group.height).toBe(300);

    // There are three children
    const nodeData2 = newNodeData("id2", "", newGroup(), newChildren([]));
    nodeData2.height = 400;
    nodeData2.children.height = 750;

    nodeData2.children.list.push(
      newNodeData("child1 of id2", "", newGroup(), newChildren([]))
    );
    nodeData2.children.list[0].height = 200;
    nodeData2.children.list[0].children.height = 0;

    nodeData2.children.list.push(
      newNodeData("child2 of id2", "", newGroup(), newChildren([]))
    );
    nodeData2.children.list[1].height = 300;
    nodeData2.children.list[1].children.height = 0;

    nodeData2.children.list.push(
      newNodeData("child3 of id2", "", newGroup(), newChildren([]))
    );
    nodeData2.children.list[2].height = 250;
    nodeData2.children.list[2].children.height = 0;

    nodeData2.recursivelyUpdateGroupHeight();
    expect(nodeData2.group.height).toBe(750);
    expect(nodeData2.children.list[0].group.height).toBe(200);
    expect(nodeData2.children.list[1].group.height).toBe(300);
    expect(nodeData2.children.list[2].group.height).toBe(250);
  });

  test("GroupHeight is set to height of node or children when children is nested", () => {
    // GroupHeight is set to height of node When node is longer than children
    // GroupHeight is set to height of children When children are longer than node

    const nodeData = newNodeData("id", "", newGroup(), newChildren([]));
    nodeData.height = 100;
    nodeData.children.height = 1700;

    // As result of recursivelyUpdateGroupWidth, groupHeight of first child is 400
    nodeData.children.list.push(
      newNodeData("child1", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[0].height = 400;
    nodeData.children.list[0].children.height = 400;

    nodeData.children.list[0].children.list.push(
      newNodeData("child1 of child1", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[0].children.list[0].height = 150;
    nodeData.children.list[0].children.list[0].children.height = 0;

    nodeData.children.list[0].children.list.push(
      newNodeData("child2 of child1", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[0].children.list[1].height = 250;
    nodeData.children.list[0].children.list[1].children.height = 0;

    // As result of recursivelyUpdateGroupWidth, groupHeight of second child is 13000
    nodeData.children.list.push(
      newNodeData("child2", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[1].height = 300;
    nodeData.children.list[1].children.height = 1300;

    nodeData.children.list[1].children.list.push(
      newNodeData("child1 of child2", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[1].children.list[0].height = 600;
    nodeData.children.list[1].children.list[0].children.height = 0;

    nodeData.children.list[1].children.list.push(
      newNodeData("child2 of child2", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[1].children.list[1].height = 700;
    nodeData.children.list[1].children.list[1].children.height = 0;

    nodeData.recursivelyUpdateGroupHeight();
    expect(nodeData.group.height).toBe(1700);
    expect(nodeData.children.list[0].group.height).toBe(400);
    expect(nodeData.children.list[0].children.list[0].group.height).toBe(150);
    expect(nodeData.children.list[0].children.list[1].group.height).toBe(250);
    expect(nodeData.children.list[1].group.height).toBe(1300);
    expect(nodeData.children.list[1].children.list[0].group.height).toBe(600);
    expect(nodeData.children.list[1].children.list[1].group.height).toBe(700);
  });
});

describe("recursivelyUpdateChildrenNodeTop", () => {
  test("Do nothing when there is zero child", () => {
    const nodeData = newNodeData("id1", "", newGroup(), newChildren([]));
    nodeData.group.top = -300;
    nodeData.height = 100;
    nodeData.children.height = 0;
    nodeData.children = newChildren([]);

    expect(nodeData.top).toBe(0);
  });

  test("NodeTop of children should be updated when there are one or more children", () => {
    // NodeTop of children is set to groupTop when height of children is longer than node
    // NodeTop of children is set to groupTop minus half different of node and children when height of node is longer than children

    // There is one child
    const nodeData1 = newNodeData("id1", "", newGroup(), newChildren([]));
    nodeData1.group.top = -100;
    nodeData1.height = 300;
    nodeData1.children.height = 200;

    nodeData1.children.list.push(
      newNodeData("child1 of id1", "", newGroup(), newChildren([]))
    );
    nodeData1.children.list[0].group.height = 200;

    nodeData1.recursivelyUpdateChildrenNodeTop();
    // why -100?
    expect(nodeData1.children.list[0].top).toBe(-50);

    // There are three children
    const nodeData2 = newNodeData("id2", "", newGroup(), newChildren([]));
    nodeData2.group.top = -600;
    nodeData2.height = 450;
    nodeData2.children.height = 600;

    nodeData2.children.list.push(
      newNodeData("child1 of id2", "", newGroup(), newChildren([]))
    );
    nodeData2.children.list.push(
      newNodeData("child2 of id2", "", newGroup(), newChildren([]))
    );
    nodeData2.children.list.push(
      newNodeData("child3 of id2", "", newGroup(), newChildren([]))
    );
    nodeData2.children.list[0].group.height = 200;
    nodeData2.children.list[1].group.height = 100;
    nodeData2.children.list[2].group.height = 300;

    nodeData2.recursivelyUpdateChildrenNodeTop();
    expect(nodeData2.children.list[0].top).toBe(-600);
    expect(nodeData2.children.list[1].top).toBe(-400);
    expect(nodeData2.children.list[2].top).toBe(-300);
  });

  test("NodeTop of children should be updated when children is nested", () => {
    // NodeTop of children is set to groupTop when height of children is longer than node
    // NodeTop of children is set to groupTop minus half different of node and children when height of node is longer than children

    const nodeData = newNodeData("id", "", newGroup(), newChildren([]));
    nodeData.group.top = -600;
    nodeData.top = 222;
    nodeData.height = 500;
    nodeData.children.height = 1700;

    // As result of recursivelyUpdateChildrenNodeTop, nodeTop of first child is -600
    nodeData.children.list.push(
      newNodeData("child1 of id", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[0].group.top = -600;
    nodeData.children.list[0].height = 450;
    nodeData.children.list[0].group.height = 450;
    nodeData.children.list[0].children.height = 250;

    nodeData.children.list[0].children.list.push(
      newNodeData("nested1 of child1", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[0].children.list[0].group.top = -500;
    nodeData.children.list[0].children.list[0].height = 200;
    nodeData.children.list[0].children.list[0].group.height = 200;
    nodeData.children.list[0].children.list[0].children.height = 0;

    nodeData.children.list[0].children.list.push(
      newNodeData("nested2 of child1", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[0].children.list[1].group.top = -300;
    nodeData.children.list[0].children.list[1].height = 50;
    nodeData.children.list[0].children.list[1].group.height = 50;
    nodeData.children.list[0].children.list[1].children.height = 0;

    // As result of recursivelyUpdateChildrenNodeTop, nodeTop of first child is -360
    nodeData.children.list.push(
      newNodeData("child2 of id", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[1].group.top = -250;
    nodeData.children.list[1].height = 600;
    nodeData.children.list[1].group.height = 1450;
    nodeData.children.list[1].children.height = 1450;

    nodeData.children.list[1].children.list.push(
      newNodeData("nested1 of child2", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[1].children.list[0].group.top = -250;
    nodeData.children.list[1].children.list[0].height = 1000;
    nodeData.children.list[1].children.list[0].group.height = 1000;
    nodeData.children.list[1].children.list[0].children.height = 0;

    nodeData.children.list[1].children.list.push(
      newNodeData("nested2 of child2", "", newGroup(), newChildren([]))
    );
    nodeData.children.list[1].children.list[1].group.top = 750;
    nodeData.children.list[1].children.list[1].height = 450;
    nodeData.children.list[1].children.list[1].group.height = 450;
    nodeData.children.list[1].children.list[1].children.height = 0;

    nodeData.recursivelyUpdateChildrenNodeTop();
    expect(nodeData.top).toBe(222);
    expect(nodeData.children.list[0].top).toBe(-600);
    expect(nodeData.children.list[0].children.list[0].top).toBe(-500);
    expect(nodeData.children.list[0].children.list[1].top).toBe(-300);
    expect(nodeData.children.list[1].top).toBe(-150);
    expect(nodeData.children.list[1].children.list[0].top).toBe(-250);
    expect(nodeData.children.list[1].children.list[1].top).toBe(750);
  });
});