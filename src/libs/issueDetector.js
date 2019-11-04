import yolo, { downloadModel } from 'tfjs-yolo-tiny'
import e from '../helper/!.js'
let model = null

const detect = async (webcam) => {
  let boxes = await yolo(webcam, model, {
    classProbThreshold: 0.5
  })
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
  if (muti === 0) {
    let boxes = await yolo(webcam, model, {
      classProbThreshold: 0.2
    })
    boxes.forEach(box => {
      if(box.className === 'person') {
        muti += 1
      }
    })
    if (muti === 0) {
      e(1, 100)
    }
  } else if (muti === 1) {
    Monitor.shakalaka.push(0)
    Monitor.shakalaka.shift() 
  } else if (muti > 1) {
    Monitor.shakalaka.push(0)
    Monitor.shakalaka.shift() 
    e(1,101)
  }

  // 杂物预判
  if (cheat) {
    e(1,103,Array.from(issue).join(','))
  }
}

const init = async () => {
  // model = await downloadModel('/models/model.json')
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
