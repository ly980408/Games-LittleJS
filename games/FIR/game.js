/*
  LittleJS - Five in a row (Gobang)
*/

'use strict'

// game vars
let lines = 15
let unitSize = 3
const mapSize = (lines - 1) * unitSize
const letters = 'ABCDEFGHIJKLMNO'
const piecesPoints = Array(lines)
  .fill(0)
  .map(() => Array(lines).fill(0))
const piecesStack = []

let isBlackNext = true // next piece's color is black
let winner = 0 // who's winner?

///////////////////////////////////////////////////////////////////////////////
function gameInit() {
  initTileCollision(vec2(mapSize))
  // move camera to center
  cameraPos = tileCollisionSize.scale(0.5)
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate() {
  if (!winner && mouseWasPressed(0)) {
    const x = Math.round(mousePos.x / unitSize)
    const y = Math.round(mousePos.y / unitSize)
    // if not in the valid range or already pieces there
    if (x < 0 || y < 0 || x > lines - 1 || y > lines - 1 || piecesPoints[x][y]) return
    // put a piece
    const p = new Pieces(vec2(x * unitSize, y * unitSize), isBlackNext)
    isBlackNext = !isBlackNext
    piecesStack.push(p)
    piecesPoints[x][y] = p

    /* 
      Check winner:
        Take the new piece as the center and look up one by one in eight directions.
        When there are five consecutive pieces of the same color, the game is over
    */
    let leftCount = 0,
      rightCount = 0,
      topCount = 0,
      bottomCount = 0,
      tlCount = 0,
      trCount = 0,
      blCount = 0,
      brCount = 0
    for (let i = 1; i < 5; i++) {
      // from left
      if (
        i == leftCount + 1 && // ensure continuous
        x - i >= 0 && // ensure in valid range
        piecesPoints[x - i][y] &&
        piecesPoints[x - i][y].isBlack == p.isBlack // a piece at the current position with the same color
      )
        leftCount++
      // right
      if (
        i == rightCount + 1 &&
        x + i < lines &&
        piecesPoints[x + i][y] &&
        piecesPoints[x + i][y].isBlack == p.isBlack
      )
        rightCount++
      // top
      if (
        i == topCount + 1 &&
        y + i < lines &&
        piecesPoints[x][y + i] &&
        piecesPoints[x][y + i].isBlack == p.isBlack
      )
        topCount++
      // bottom
      if (
        i == bottomCount + 1 &&
        y - i >= 0 &&
        piecesPoints[x][y - i] &&
        piecesPoints[x][y - i].isBlack == p.isBlack
      )
        bottomCount++

      // top left
      if (
        i == tlCount + 1 &&
        x - i >= 0 &&
        y + i < lines &&
        piecesPoints[x - i][y + i] &&
        piecesPoints[x - i][y + i].isBlack == p.isBlack
      )
        tlCount++
      // top right
      if (
        i == trCount + 1 &&
        x + i < lines &&
        y + i < lines &&
        piecesPoints[x + i][y + i] &&
        piecesPoints[x + i][y + i].isBlack == p.isBlack
      )
        trCount++
      // bottom left
      if (
        i == blCount + 1 &&
        x - i >= 0 &&
        y - i >= 0 &&
        piecesPoints[x - i][y - i] &&
        piecesPoints[x - i][y - i].isBlack == p.isBlack
      )
        blCount++
      // bottom right
      if (
        i == brCount + 1 &&
        x + i < lines &&
        y - i >= 0 &&
        piecesPoints[x + i][y - i] &&
        piecesPoints[x + i][y - i].isBlack == p.isBlack
      )
        brCount++

      // calc result
      if (
        leftCount + rightCount + 1 === 5 ||
        topCount + bottomCount + 1 === 5 ||
        tlCount + brCount + 1 === 5 ||
        trCount + blCount + 1 === 5
      ) {
        winner = p.isBlack ? 'Black' : 'White'
        break
      }
    }
  }
  if (winner && keyWasPressed(13)) {
    winner = 0
    piecesStack.forEach(p => p.destroy())
    piecesStack.length = 0
    piecesPoints.forEach(row => row.forEach(i => (i = 0)))
  }
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost() {}

///////////////////////////////////////////////////////////////////////////////
function gameRender() {
  // draw a grey square in the background without using webgl
  drawRect(cameraPos, tileCollisionSize.add(vec2(5)), new Color(0.2, 0.2, 0.2), 0, 0)
  // draw grid
  for (let i = 0; i < lines; i++) {
    drawLine(vec2(i * unitSize, 0), vec2(i * unitSize, mapSize), 0.1, new Color(), 0)
    drawLine(vec2(0, i * unitSize), vec2(mapSize, i * unitSize), 0.1, new Color(), 0)
    drawText(lines - i, vec2(-1.5, i * unitSize))
    drawText(letters[i], vec2(i * unitSize, mapSize + 1.5))
  }
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost() {
  // draw to overlay canvas for hud rendering
  drawText('Five in a row', cameraPos.add(vec2(0, mapSize / 2 + 4)), 2, new Color(), 0.2)
  if (winner) {
    drawText(winner + ' win!', cameraPos.add(vec2(0, 2)), 4, new Color(), 0.2)
    drawText('Press enter to start a new round', cameraPos.add(vec2(0, -2)), 2, new Color(), 0.2)
  }
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, 'tiles.png')
