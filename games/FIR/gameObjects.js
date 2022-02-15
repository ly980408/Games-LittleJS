
class Pieces extends EngineObject {
  constructor(pos, isBlack) {
    super(pos, vec2(3), 0, vec2(tileSizeDefault), 0, isBlack ? new Color(0,0,0) : new Color)

    this.isBlack = !!isBlack
  }
}