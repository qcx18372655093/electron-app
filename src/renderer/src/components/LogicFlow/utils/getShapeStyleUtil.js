export const getShapeStyleFuction = (style, properties) => {
  if (properties.fill) {
    style.fill = properties.fill
  }
  if (properties.stroke) {
    style.stroke = properties.stroke
  }
  if (properties.strokeWidth) {
    style.strokeWidth = properties.strokeWidth
  }
  return style
}

export const getTextStyleFunction = (style = {}, properties) => {
  if (properties.fontColor) {
    style.color = properties.fontColor
  }
  if (properties.fontSize) {
    style.fontSize = properties.fontSize
  }
  if (properties.fontFamily) {
    style.fontFamily = properties.fontFamily
  }
  if (properties.lineHeight) {
    style.lineHeight = properties.lineHeight
  }
  if (properties.textAlign) {
    style.textAlign = properties.textAlign
  }
  if (properties.fontWeight) {
    style.fontWeight = properties.fontWeight
  }
  if (properties.textDecoration) {
    style.textDecoration = properties.textDecoration
  }
  if (properties.fontStyle) {
    style.fontStyle = properties.fontStyle
  }
  return style
}
