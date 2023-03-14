export function clear(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

/**
 * @param {[ x: number, y: number ]} position - top left corner
 * @param {number} value - does inside the element 
 */
export function indexItem(position, value, size, ctx) {
  const fontSize = Math.round(size / 2)
  const textMargin = (position[0] + fontSize) - ((value.toString().length / 2) * (fontSize / 2)) //- (value.length / 2 * 7)
  ctx.fillRect(position[0], position[1], size, size)
  ctx.font = `${fontSize}px serif`
  ctx.clearRect(position[0] + 5, position[1] + 5, size - 10, size - 10)
  ctx.fillText(value, textMargin, position[1] + (size / 2 + (size / 8)))
}

export function list(arr, size = 100, startHeight = 0, ctx) {
  const newLineIndexes = [0]
  arr.forEach((value, index) => {
    if (((index - newLineIndexes[newLineIndexes.length - 1]) * (size + 15)) + (size + 15) > ctx.canvas.width) {
      newLineIndexes.push(index)
    }
    indexItem([(index - newLineIndexes[newLineIndexes.length - 1]) * (size + 15) + 15, (size + 15) * (newLineIndexes.indexOf(newLineIndexes[newLineIndexes.length - 1]) + 1) + startHeight], value, size, ctx)
  })
}


/**
 * @param {string} text - does inside the element 
 * @param {[ x: number, y: number ]} position - top left corner
 */
export function button(text, position, width, height, ctx) {
  const margin = position[0] + (width / 2) - (text.length / 2 * 7)
  ctx.fillRect(position[0], position[1], width, height)
  ctx.clearRect(position[0] + 5, position[1] + 5, 90, 40)
  ctx.font = "16px serif"
  ctx.fillText(text, margin, position[1] + (height / 2) + 7)
}

export function overlay(ctx) {
  ctx.globalAlpha = 0.9
  ctx.fillStyle = "#555"
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.font = "32px serif"
  ctx.fillStyle = "#ff0000"
  ctx.fillText("X", ctx.canvas.width - 32, 32)
  ctx.fillStyle = "#000"
  ctx.globalAlpha = 1
}

export async function steps(steps, ctx, posY, setHeight) {
  // console.log('steps',steps.length)
  steps.forEach(async (step, i) => {
    // function logSteps() {
      // for (const [key, value,] of Object.entries(step)) {
        
      // }
    // }
    drawStep(step, i, ctx, posY, setHeight)
  })
}
// todo make this adapt to different structures by iterating through Object keys and values
export function drawStep(step, returnStackNumber, ctx, posY, setHeight) {
  const height = Object.entries(step).length * 150 + 100
  setHeight(height)
  // horizontal line between steps
  if (returnStackNumber > 0) {
    ctx.fillStyle = "#333"
    ctx.fillRect(0, posY - 10 + (returnStackNumber * height), ctx.canvas.width / 2, 4)
  }
  // the return number in order or returns
  ctx.fillStyle = "#fff"
  ctx.font = "24px serif"
  ctx.fillText(`return #${returnStackNumber + 1}`, 10, posY + 24 + (returnStackNumber * height))

  // console.log(Object.entries(step).length)
  for (const [index, [key, value]] of Object.entries(Object.entries(step))) {
    ctx.fillStyle = "#fff"
    ctx.fillText(`${key} ${typeof value === 'number' ? `#${value}` : typeof value === 'string' ? `${value}` : ''}`, 10, posY + 50 + (150 * (index)) + (returnStackNumber * height))
    ctx.fillStyle = "#000"
    if (value?.length && value !== undefined) {
      list([...value], 50, posY  + (150 * (index)) + (returnStackNumber * height), ctx)
    }
    else if (value === undefined || !typeof value === ('number' || 'string')) {
      ctx.fillText("__", 10, posY + 100 + (150 * (index)) + (returnStackNumber * height))
    }
  }
}