/**
 * @param {Event} e 
 * @param {(scrollBy: number) => void} scroll 
 */
export function scrollWithKeys(e, scroll) {
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

/**
 * @param {Event} e 
 * @param {(scrollBy: number) => void} scroll 
 */
export function scrollWithWheel(e, scroll) {
  // console.log(e)
  if (e.deltaY < 0) {
    scroll(50)
  }
  else if (e.deltaY > 0) {
    scroll(-50)
  }
}
let lastTouchPos = undefined
export function scrollWithTouch(e, scroll) {
  if (showingOverlay) {
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

/**
 * resets lastTouchPos to prevent bug when starting a new touch
 */
export function touchEnd() {
  lastTouchPos = undefined 
}