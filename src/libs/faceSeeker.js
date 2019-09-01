import * as faceapi from 'face-api.js'
import e from '../helper/!.js'
let nobody = false
let fnet = null
let video = null
const miniumDis = 0.3


const seek = async function(v = video) {
  let face = await faceapi.detectSingleFace(v, fnet).withFaceLandmarks(true).withFaceDescriptor()
  if (!face) {
    Monitor.shakalaka.push(1)
    Monitor.shakalaka.shift()
  } else {
    Monitor.shakalaka.push(0)
    Monitor.shakalaka.shift()
  }
  if (face && nobody) {
    nobody = false
    console.log('人脸出现，开始进行身份认证')
    if (!compare(Monitor.face, face)) {
      console.log('中途换人且不是同一个人')
      e(1, 105)
    } else {
      console.log('通过认证')
    }
  }

  // 无人在场预判
  if (Monitor.shakalaka[0] === 1 && Monitor.shakalaka[1] === 1 && Monitor.shakalaka[2] === 1 && Monitor.shakalaka[3] === 1 && !nobody) {
    nobody = true
    e(1, 100)
  }
  return face
}

const init = async (v) => {
  video = v
  await faceapi.loadTinyFaceDetectorModel('/models')
  await faceapi.loadFaceLandmarkTinyModel('/models')
  await faceapi.loadFaceRecognitionModel('/models')
  fnet = new faceapi.TinyFaceDetectorOptions({inputSize: 416, scoreThreshold: 0.2})
}

const compare = (pre, next) => {
  if(pre && pre.descriptor) {
    pre = pre.descriptor
  }
  if(next && next.descriptor) {
    next = next.descriptor
  }
  if(!(pre && next && pre.length && next.length)) {
    console.log('在识别时 人脸参数不匹配')
    return
  }
  let odis = 0;
  for (let i = 0; i < pre.length; i ++) {
    odis += ((pre[i] - next[i]) * (pre[i] - next[i]))
  }
  console.log('欧氏距离')
  console.log(odis)
  return odis < miniumDis
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