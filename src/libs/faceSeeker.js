import * as faceapi from 'face-api.js'
import e from '../helper/!.js'
let fnet = null
let video = null
const miniumDis = 0.2

const seek = async function(v = video) {
  let face = await faceapi.detectSingleFace(v, fnet).withFaceLandmarks(true).withFaceDescriptor()
  if (face && window.nobody) {
    nobody = false
    console.log('人脸出现，开始进行身份认证')
    if (!await compare(Monitor.face, face)) {
      console.log('中途换人且不是同一个人')
      e(1, 105)
    } else {
      console.log('通过认证')
    }
  }

  return face
}

const init = async (v, cb) => {
  video = v ? v : video
  await faceapi.loadTinyFaceDetectorModel('https://exam.zhrccp.com/static/js_models')
  if(cb && typeof(cb) === 'function') {
    cb(1)
  }
  await faceapi.loadFaceLandmarkTinyModel('https://exam.zhrccp.com/static/js_models')
  if(cb && typeof(cb) === 'function') {
    cb(2)
  }
  await faceapi.loadFaceRecognitionModel('https://exam.zhrccp.com/static/js_models')
  if(cb && typeof(cb) === 'function') {
    cb(3)
  }
  fnet = new faceapi.TinyFaceDetectorOptions({inputSize: 416, scoreThreshold: 0.2})
}

const compare = async (pre, next) => {
  if (!pre) {
    window.Monitor.face = await faceapi.detectSingleFace(video, fnet).withFaceLandmarks(true).withFaceDescriptor()
    pre = window.Monitor.face
  }
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
  console.log(odis < miniumDis)
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