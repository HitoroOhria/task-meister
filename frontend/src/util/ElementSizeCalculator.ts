class ElementSizeCalculator {
  private canvasCtx: CanvasRenderingContext2D

  constructor(font: string) {
    this.canvasCtx = this.initCanvasCtx(font)
  }

  private initCanvasCtx = (font: string): CanvasRenderingContext2D => {
    const canvasCtx = document.createElement('canvas').getContext('2d')!
    canvasCtx.font = font

    return canvasCtx
  }

  public measureLongestLineWidth(text: string): number {
    return this.measureWidth(this.findLongestLine(text))
  }

  public findLongestLine(text: string): string {
    return text.split('\n').reduce((preLine, curLine) => this.pickLongerLine(preLine, curLine), '')
  }

  private pickLongerLine(firstLine: string, secondLine: string) {
    const firstLineWidth = this.measureWidth(firstLine)
    const secondLineWidth = this.measureWidth(secondLine)

    return firstLineWidth > secondLineWidth ? firstLine : secondLine
  }

  // Measure text width with all chars on one line.
  // ex. return 13.33333333
  public measureWidth(text: string): number {
    return this.canvasCtx.measureText(text).width
  }
}

export default ElementSizeCalculator
