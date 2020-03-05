import yolo, { downloadModel } from "tfjs-yolo-tiny";
import * as posnet from "@tensorflow-models/posenet";
// import * as faceapi from 'face-api.js'

let model = null;
let net = null;
let fnet = null;

const imageScaleFactor = 0.5;
const outputStride = 16;
const flipHorizontal = false;

onmessage = async e => {
  let message = e.data;
  postMessage("收到请求");
  console.log(message);
  console.log(WorkerNavigator);
  let result = null;
  if (!message || typeof message.id !== "number") {
    console.log("调用worker没有传入合适的参数");
    return;
  }
  switch (message.id) {
    case 0: // init
      console.log("worker线程开始加载yolo");
      model = await downloadModel("/models/model.json");
      // console.log('worker线程开始加载posenet')
      // net = await posnet.load()
      // console.log('worker线程开始加载faceapi')
      // await faceapi.loadTinyFaceDetectorModel('/models')
      // await faceapi.loadFaceLandmarkTinyModel('/models')
      // await faceapi.loadFaceRecognitionModel('/models')
      // fnet = new faceapi.TinyFaceDetectorOptions({inputSize: 416, scoreThreshold: 0.2})
      postMessage({
        id: message.id,
        content: result
      });
      break;

    case 1: // face-api
      // result = await faceapi.detectSingleFace(message.content, fnet).withFaceLandmarks(true).withFaceDescriptor()
      postMessage({
        id: message.id,
        content: result
      });
      break;

    case 2: // yolo
      // result = await yolo(message.content, model, {
      //   classProbThreshold: 0.5
      // })
      postMessage({
        id: message.id,
        content: result
      });
      break;

    case 3: // posenet
      // result = await net.estimateSinglePose(
      //   message.content,
      //   imageScaleFactor,
      //   flipHorizontal,
      //   outputStride
      // )
      postMessage({
        id: message.id,
        content: result
      });
      break;
  }
};
