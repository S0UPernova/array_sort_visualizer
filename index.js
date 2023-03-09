// todo work on rendering arrays to show sorting algorithms visually

// todo remove as many hard coded numbers as possible so that it will show on other screen sizes

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext("2d")
ctx.canvas.width = window.innerWidth - 40
ctx.canvas.height = window.innerHeight - 40

const qOfScreen = ctx.canvas.width / 4
const addPosition = { x: qOfScreen - 50, y: 20, with: 100, height: 50 },
  randomizePosition = { x: qOfScreen * 3 - 50, y: 20, with: 100, height: 50 },
  sortButton = { x: qOfScreen * 2 - 50, y: 20, with: 100, height: 50 },
  totalHeightOfReturnStack = 600,
  steps = []

let arr = [1, 2, 3],
  showingOverlay = false,
  posY = 0

function main() {
  if (canvas.getContext) {
    if (showingOverlay === false) {
      clear()
      drawButton('add', [addPosition.x, addPosition.y], addPosition.with, addPosition.height)
      drawButton('randomize', [randomizePosition.x, randomizePosition.y], randomizePosition.with, randomizePosition.height)
      drawButton('sort', [sortButton.x, sortButton.y], sortButton.with, sortButton.height)
      drawList(arr)
    }
    else {
      clear()
      overlay()
      showMerge()
    }
    requestAnimationFrame(main)
  }
  else {
    alert("Please use a browser that supports canvas")
  }
}

function clear() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

/**
 * @param {[ x: number, y: number ]} position - top left corner
 * @param {number} value - does inside the element 
 */
function drawIndexItem(position, value, size) {
  const fontSize = Math.round(size / 2)
  const textMargin = (position[0] + fontSize) - ((value.toString().length / 2) * (fontSize / 2)) //- (value.length / 2 * 7)
  ctx.fillRect(position[0], position[1], size, size)
  ctx.font = `${fontSize}px serif`
  ctx.clearRect(position[0] + 5, position[1] + 5, size - 10, size - 10)
  ctx.fillText(value, textMargin, position[1] + (size / 2 + (size / 8)))
}

function drawList(arr, size = 100, startHeight = 0) {
  const newLineIndexes = [0]
  arr.forEach((value, index) => {
    if (((index - newLineIndexes[newLineIndexes.length - 1]) * (size + 15)) + (size + 15) > ctx.canvas.width) {
      newLineIndexes.push(index)
    }
    drawIndexItem([(index - newLineIndexes[newLineIndexes.length - 1]) * (size + 15) + 15, (size + 15) * (newLineIndexes.indexOf(newLineIndexes[newLineIndexes.length - 1]) + 1) + startHeight], value, size)
  })
}


/**
 * @param {string} text - does inside the element 
 * @param {[ x: number, y: number ]} position - top left corner
 */
function drawButton(text, position, width, height) {
  const margin = position[0] + (width / 2) - (text.length / 2 * 7)
  ctx.fillRect(position[0], position[1], width, height)
  ctx.clearRect(position[0] + 5, position[1] + 5, 90, 40)
  ctx.font = "16px serif"
  ctx.fillText(text, margin, position[1] + (height / 2) + 7)
}

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
  // ctx.canvas.width - 24, 24
  else if ( // close button
    e.x > ctx.canvas.width - 48
    && e.x < ctx.canvas.width //- 24 + 24
    && e.y > 0
    && e.y < 48
  ) {
    console.log('x clicked')
    showingOverlay = false
  }
  console.log('x', e.x)
  console.log('y', e.y)
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function overlay() {
  ctx.globalAlpha = 0.9
  ctx.fillStyle = "#555"
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.font = "32px serif"
  ctx.fillStyle = "#ff0000"
  ctx.fillText("X", ctx.canvas.width - 32, 32)
  ctx.fillStyle = "#000"
  ctx.globalAlpha = 1
}

async function showMerge() {
  steps.forEach(async (step, i) => {
    drawStep(step, i)
  })
}
function drawStep(step, returnStackNumber) {
  // horizontal line between steps
  if (returnStackNumber > 0) {
    ctx.fillStyle = "#333"
    ctx.fillRect(0, posY - 10 + (returnStackNumber * totalHeightOfReturnStack), ctx.canvas.width / 2, 4)
  }
  // the return number in order or returns
  ctx.fillStyle = "#fff"
  ctx.font = "24px serif"
  ctx.fillText(`return #${returnStackNumber + 1}, depth ${step.level}`, 10, posY + 24 + (returnStackNumber * totalHeightOfReturnStack))

  // input
  ctx.fillText(`input`, 10, posY + 50 + (returnStackNumber * totalHeightOfReturnStack))
  ctx.fillStyle = "#000"
  drawList([...step.input], 50, posY + (returnStackNumber * totalHeightOfReturnStack))

  // left
  ctx.fillStyle = "#fff"
  ctx.fillText(`returned from left`, 10, posY + 200 + (returnStackNumber * totalHeightOfReturnStack))
  if (step.left?.length) {
    ctx.fillStyle = "#000"
    drawList([...step.left], 50, posY + 150 + (returnStackNumber * totalHeightOfReturnStack))
  }
  else {
    ctx.fillText(`__`, 10, posY + 250 + (returnStackNumber * totalHeightOfReturnStack))
  }

  // right
  ctx.fillStyle = "#fff"
  ctx.fillText(`returned from right`, 10, posY + 350 + (returnStackNumber * totalHeightOfReturnStack))
  if (step.right?.length) {
    ctx.fillStyle = "#000"
    drawList([...step.right], 50, posY + 300 + (returnStackNumber * totalHeightOfReturnStack))
  }
  else {
    ctx.fillText(`__`, 10, posY + 400 + (returnStackNumber * totalHeightOfReturnStack))
  }

  // output
  ctx.fillStyle = "#fff"
  ctx.fillText(`output`, 10, posY + 500 + (returnStackNumber * totalHeightOfReturnStack))
  if (step?.output?.length) {
    ctx.fillStyle = "#000"
    drawList(step.output, 50, posY + 450 + (returnStackNumber * totalHeightOfReturnStack))
  }
}

function jumpToNextItem(jumpBy) {
  posY -= jumpBy
}

// todo add stat for what layer in recurrsion you are in
/**
 * 
 * @param {number[]} arr 
 */
async function mergeSort(arr, level = 0) {
  // early return when there is one or zero elements
  if (arr.length <= 1) {
    // only the return is part of the algorithm
    steps.push({ input: [...arr], left: undefined, right: undefined, output: [...arr], level: level })
    await delay(1000)
    jumpToNextItem(totalHeightOfReturnStack)
    return [...arr]
  }
  const left = await mergeSort(arr.slice(0, Math.floor(arr.length / 2)), level + 1)
  const right = await mergeSort(arr.slice(Math.floor(arr.length / 2)), level + 1)

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
  steps.push({ input: arr, left: initialLeft, right: initialRight, output: [...output, ...left, ...right], level: level })
  await delay(1000)
  if (level > 0) jumpToNextItem(totalHeightOfReturnStack)

  return [...output, ...left, ...right]
}
function scroll(scrollBy) {
  posY += scrollBy
}



function handleKey(e) {
  if (e.keyCode === 27) {
    showingOverlay = false
  }
  else if (e.keyCode === 38) {
    scroll(50)
  }
  else if (e.keyCode === 40) {
    scroll(-50)
  }
}
function handleScroll(e) {
  // console.log(e)
  if (e.deltaY < 0) {
    scroll(50)
  }
  else if (e.deltaY > 0) {
    scroll(-50)
  }
}
let lastTouchPos = undefined
function handleTouchScroll(e) {
  // console.log(lastTouchPos)
  if (showingOverlay) {
    e.preventDefault()
    if (lastTouchPos === undefined) {
      lastTouchPos = e.touches[0].pageY
      return
    }
    else {
      // const tmp = 
      scroll(e.touches[0].pageY - lastTouchPos)
      lastTouchPos = e.touches[0].pageY
    }
  }

}

function init() {
  window.requestAnimationFrame(main)
  canvas.addEventListener("mousedown", handleClick)
  window.addEventListener("keydown", handleKey)
  window.addEventListener("wheel", handleScroll)
  window.addEventListener("touchmove", handleTouchScroll)
  window.addEventListener("touchend", () => { lastTouchPos = undefined })
}
init()