import yolo, { downloadModel } from 'tfjs-yolo-tiny'

let mutiplePersonLastTime = 0
let noPersonLastTime = 0
let webcam = null
let model = null

const detect = async (callback) => {
  let boxes = await yolo(webcam.capture(), model)
  let cheat = false
  let issue = new Set()                  // 违规物品名称表
  let countPerson = 0
  let facePosition = null          // 人脸定位
  boxes.forEach(box => {
    if (box.className === 'cell phone'||box.className === 'book') {
      cheat = true
      issue.add(box.className)
    }
    if(box.className === 'person') {
      countPerson += 1
      facePosition = {
        left: box.left,
        top: box.top,
        width: box.width,
        height: box.height
      }
    }
  })
  if (countPerson === 0) {
    noPersonLastTime += 1
    console.log('无人脸')
    callback(1, {
      id: 100,
      name: '无人脸',
      time: Date.now()
    })
  } else if (countPerson === 1) {

  } else {
    mutiplePersonLastTime += 1
    console.log('多人同屏')
    callback(1,{
      id: 101,
      name: '多人同屏',
      time: Date.now()
    })
  }
  if (noPersonLastTime === 2) {
    noPersonLastTime = 0
    callback(2,{
      id: 200,
      name: '无人脸超过10秒',
      time: Date.now()
    })
  }
  if (mutiplePersonLastTime === 2) {
    mutiplePersonLastTime = 0
    callback(2,{
      id: 200,
      name: '多人同屏超过10秒',
      time: Date.now()
    })
  }
  if (cheat) {
    console.log(`检测到违规物品：${Array.from(issue).join('')}`)
    callback(1,{
      id: 103,
      name: `检测到违规物品：${Array.from(issue).join('')}`,
      time: Date.now()
    })
  } else {}
}

const init = async (webcam) => {
  webcam = webcam
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
