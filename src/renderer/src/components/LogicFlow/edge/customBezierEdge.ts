import { BezierEdge, BezierEdgeModel } from '@logicflow/core'
import { getShapeStyleFuction, getTextStyleFunction } from '../utils/getShapeStyleUtil'

// 贝塞尔曲线
class Model extends BezierEdgeModel {
  constructor(data, graphModel) {
    super(data, graphModel)
    this.strokeWidth = 1
  }

  getEdgeStyle() {
    const attributes = super.getEdgeStyle()
    const properties = this.properties;
    const style = getShapeStyleFuction(attributes, properties)
    return { ...style }
  }
}

export default {
  type: "custom-bezier",
  view: BezierEdge,
  model: Model
};
