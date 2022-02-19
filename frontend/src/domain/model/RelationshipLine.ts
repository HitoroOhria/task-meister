import { pathLineRatio } from "~/components/organisms/SVGArea";
import { horizontalMargin } from "~/components/organisms/Node";

import NodeData from "~/domain/model/NodeData";
import PathLine, { newPathLine, pathLineImpl } from "~/domain/model/PathLine";
import BezierCurve, {
  bezierCurveImpl,
  newBezierCurve,
} from "~/domain/model/BezierCurve";
import OriginPoint from "~/domain/model/OriginPoint";

type RelationshipLine = {
  pathLine: PathLine;
  bezierCurve: BezierCurve;

  getPathCommand(): string;

  updatePoints(
    originPoint: OriginPoint,
    parentNode: NodeData,
    node: NodeData
  ): void;
};

export const newRelationshipLine = (): RelationshipLine => {
  return {
    ...relationshipLineImpl,
    pathLine: newPathLine(),
    bezierCurve: newBezierCurve(),
  };
};

export const relationshipLineImpl: RelationshipLine = {
  pathLine: pathLineImpl,
  bezierCurve: bezierCurveImpl,

  getPathCommand(): string {
    return [
      this.pathLine.moveTo(),
      this.pathLine.lineTo(),
      this.bezierCurve.curveTo(),
    ].join(" ");
  },

  updatePoints(originPoint: OriginPoint, parentNode: NodeData, node: NodeData) {
    const lineStartPointX = parentNode.getElementEndSVGX(originPoint.svgX);
    const lineEndPointX =
      lineStartPointX + horizontalMargin * 2 * pathLineRatio;
    const lineY = parentNode.getElementCenterSVGY(originPoint.svgY);

    const controlPointX =
      lineEndPointX + (horizontalMargin * 2 * (1 - pathLineRatio)) / 2;
    const endPointX = lineStartPointX + horizontalMargin * 2;
    const endPointY = node.getElementCenterSVGY(originPoint.svgY);

    this.pathLine.setPoints(lineStartPointX, lineEndPointX, lineY);
    this.bezierCurve.setPoints(controlPointX, lineY, endPointX, endPointY);
  },
};
Object.freeze(relationshipLineImpl);

export default RelationshipLine;
