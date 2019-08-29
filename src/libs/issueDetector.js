import yolo, { downloadModel } from 'tfjs-yolo-tiny'
import { Webcam } from '../helper/webcam.js'
import e from '../helper/!.js'
let model = null
let shakalaka = [0, 0, 0]
const detect = async (webcam) => {
  let boxes = await yolo(webcam.capture(), model)
  let issue = new Set()                  // 违规物品名称表
  let muti = 0
  let cheat = false
  boxes.forEach(box => {
    if (box.className === 'cell phone' || box.className === 'book') {
      issue.add(box.className)
      cheat = true
    }
    if(box.className === 'person') {
      muti += 1
    }
  })
  if (muti > 1) {
    shakalaka.push(1)
    shakalaka.shift()
  }
  // 多人同屏预判
  if (shakalaka[0] === 1 && shakalaka[1] === 1 && shakalaka[2] === 1){
    e(1,101)
  }

  // 杂物预判
  if (cheat) {
    e(1,103)
  }
}

const init = async () => {
  model = await downloadModel()
}

const issueDetector = {
  init,
  detect
}

if(window.Monitor){
  window.Monitor.issueDetector = issueDetector
} else {
  window.Monitor = {
    issueDetector
  }
}

export default issueDetector
