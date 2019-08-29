import * as posnet from '@tensorflow-models/posenet'
const imageScaleFactor = 0.5
const outputStride = 16
const flipHorizontal = false
let net = null
let Pose = null
let video = null

async function init(imageElement) {
  net = await posnet.load()
  video = imageElement
}

async function detect(v) {
  let imageElement = v || video
  if(!imageElement) {
    new Error('没有合适的图像载体')
    return
  }
  const pose = await net.estimateSinglePose(
    imageElement,
    imageScaleFactor,
    flipHorizontal,
    outputStride
  )
  Pose = pose
  return Pose
}

function getPose() {
  return Pose
}

const poseDetect = {
  init,
  detect,
  getPose
}
if(window.Monitor) {
  window.Monitor.poseDetect = poseDetect
} else {
  window.Monitor = {
    poseDetect
  }
}

export default poseDetect