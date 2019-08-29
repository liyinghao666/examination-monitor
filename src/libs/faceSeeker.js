import * as faceapi from 'face-api.js'
import e from '../helper/!.js'
let nobody = false
let fnet = null
let video = null
const miniumDis = 0.3
let shakalaka = [0, 0, 0]
const seek = async function(v = video) {
  let face = await faceapi.detectSingleFace(v, fnet).withFaceLandmarks(true)
  if (!face) {
    shakalaka.push(1)
    shakalaka.shift()
  }
  if (face && nobody) {
    nobody = false
    if (!compare(Monitor.face, face)) {
      e(1, 105)
    }
  }

  // 无人在场预判
  if (shakalaka[0] === 1 && shakalaka[1] === 1 && shakalaka[2] === 1 && !nobody) {
    nobody = true
    e(1, 100)
  }
  return face
}

const init = async (v) => {
  video = v
  console.log('faceapi 加载tinydetector模型')
  await faceapi.loadTinyFaceDetectorModel('/models')
  console.log('faceapi 加载landmark模型')
  await faceapi.loadFaceLandmarkTinyModel('/models')
  fnet = new faceapi.TinyFaceDetectorOptions({inputSize: 416, scoreThreshold: 0.3})
}

const compare = async (pre, next) => {
  if(pre && pre.descriptor) {
    pre = pre.descriptor
  }
  if (!next)next = await seek()
  if(next && next.descriptor) {
    next = next.descriptor
  }
  if(!(pre && next && pre.length && next.length))
    return
  let odis = 0;
  for (let i = 0; i < pre.length; i ++) {
    odis += ((pre[i] - next[i]) * (pre[i] - next[i]))
  }
  return odis < miniumDis ;
}

const faceSeeker = {
  seek,
  init,
  compare
}

if(window.Monitor) {
  window.Monitor.faceSeeker = faceSeeker
} else {
  window.Monitor = {
    faceSeeker
  }
}


export default faceSeeker