import * as Draw from "./draw.js"
import * as Handle from './handlers.js'

//setup
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext("2d")
ctx.canvas.width = window.innerWidth - 40
ctx.canvas.height = window.innerHeight - 40

// immutable variables
const qOfScreen = ctx.canvas.width / 4
const addPosition = { x: qOfScreen - 50, y: 20, with: 100, height: 50 },
  randomizePosition = { x: qOfScreen * 3 - 50, y: 20, with: 100, height: 50 },
  sortButton = { x: qOfScreen * 2 - 50, y: 20, with: 100, height: 50 },
  steps = []

// mutable variables
let arr = [1, 2, 3],
  totalHeightOfReturnStack = 1000,
  showingOverlay = false,
  posY = 0

// this is run each loop
function main() {
  if (canvas.getContext) {
    if (showingOverlay === false) {
      Draw.clear(ctx)
      Draw.button('add', [addPosition.x, addPosition.y], addPosition.with, addPosition.height, ctx)
      Draw.button('randomize', [randomizePosition.x, randomizePosition.y], randomizePosition.with, randomizePosition.height, ctx)
      Draw.button('sort', [sortButton.x, sortButton.y], sortButton.with, sortButton.height, ctx)
      Draw.list(arr, 100, 0, ctx)
    }
    else {
      Draw.clear(ctx)
      Draw.overlay(ctx)
      Draw.steps(steps, ctx, posY, setHeight)// todo make the total return height dynamic
    }
    requestAnimationFrame(main)
  }
  else {
    alert("Please use a browser that supports canvas")
  }
}

/**
 * @param {number} time - milliseconds 
 * @returns {Promise}
 */
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

/**
 * changes posY to jump to relative location
 * @param {number} jumpBy 
 */
function jumpToNextItem(jumpBy) {
  posY -= jumpBy
}

/**
 * sets height to jump by
 * @param {number} height 
 * @returns {void}
 */
function setHeight(height) {
  totalHeightOfReturnStack = height
}

/**
 * 
 * @param {number[]} arr 
 */
async function mergeSort(arr, depth = 0) {
  // early return when there is one or zero elements
  if (arr.length <= 1) {
    // only the return is part of the algorithm
    steps.push({ depth: depth, input: [...arr], left: undefined, right: undefined, output: [...arr] })
    await delay(1000)
    jumpToNextItem(totalHeightOfReturnStack)
    return [...arr]
  }
  const left = await mergeSort(arr.slice(0, Math.floor(arr.length / 2)), depth + 1)
  const right = await mergeSort(arr.slice(Math.floor(arr.length / 2)), depth + 1)

  // these are for display purposes not the algorithm
  const initialLeft = left.slice()
  const initialRight = right.slice()

  let output = []
  while (left.length && right.length) {
    if (left[0] < right[0]) {
      output.push(left.shift())
    }
    else {
      output.push(right.shift())
    }
  }

  // from here only the return is part of the algorithm
  steps.push({ depth: depth, input: arr, left: initialLeft, right: initialRight, output: [...output, ...left, ...right] })
  await delay(1000)
  if (depth > 0) jumpToNextItem(totalHeightOfReturnStack)

  return [...output, ...left, ...right]
}

// changes posY to scroll
function scroll(scrollBy) {
  posY += scrollBy
}

// this one is a little hard to move, so here it stays for now
async function handleClick(e) {
  // add array item button
  if (
    e.x > addPosition.x
    && e.x < addPosition.x + addPosition.with
    && e.y > addPosition.y
    && e.y < addPosition.y + addPosition.height
  ) {
    arr.push(arr.length + 1)
  }
  // randomize array button
  else if (
    e.x > randomizePosition.x
    && e.x < randomizePosition.x + randomizePosition.with
    && e.y > randomizePosition.y
    && e.y < randomizePosition.y + randomizePosition.height
  ) {
    arr.sort(() => Math.random() - 0.5)
  }
  else if (
    e.x > sortButton.x
    && e.x < sortButton.x + sortButton.with
    && e.y > sortButton.y
    && e.y < sortButton.y + sortButton.height
  ) {
    showingOverlay = true
    steps.splice(0, steps.length)
    posY = 0
    arr = [...await mergeSort(arr)]
  }
  else if ( // close button
    e.x > ctx.canvas.width - 48
    && e.x < ctx.canvas.width //- 24 + 24
    && e.y > 0
    && e.y < 48
  ) {
    showingOverlay = false
  }
}

// initializes the loop and sets up event listeners
function init() {
  window.requestAnimationFrame(main)
  canvas.addEventListener("mousedown", handleClick)
  window.addEventListener("keydown", (e) => { Handle.scrollWithKeys(e, scroll) })
  window.addEventListener("wheel", (e) => { Handle.scrollWithWheel(e, scroll) })
  window.addEventListener("touchmove", (e) => { Handle.scrollWithTouch(e, scroll) })
  window.addEventListener("touchend", () => { Handle.touchEnd() })
}
init()