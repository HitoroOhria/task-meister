import { newNodeData } from "~/domain/model/NodeData";
import { newGroup } from "~/domain/model/Group";
import { newChildren } from "~/domain/model/Children";

describe("findNodeDataById", () => {
  test("Return null when do not have children and id does not match that", () => {
    const nodeData = newNodeData("id", "", newGroup(), newChildren([]));

    expect(nodeData.findByIdFromGroup("not-match")).toBe(null);
  });

  test("Return self when do not have children and id matches that", () => {
    const nodeData = newNodeData("id", "", newGroup(), newChildren([]));

    expect(nodeData.findByIdFromGroup("id")).toBe(nodeData);
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

    expect(nodeData.findByIdFromGroup("not-match")).toBe(null);
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

    expect(nodeData.findByIdFromGroup("parent")).toBe(nodeData);
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

    expect(nodeData.findByIdFromGroup("child1 of parent")).toBe(
      nodeData.children.list[0]
    );
    expect(nodeData.findByIdFromGroup("nested2 of child2")).toBe(
      nodeData.children.list[1].children.list[1]
    );
  });
});
