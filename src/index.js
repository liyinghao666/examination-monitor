// import { Webcam } from './helper/webcam.js'
import e from "./helper/!.js";

// 人体姿态识别
import "./libs/poseDetect.js";
let poseDetect = null;
if (window.Monitor && window.Monitor.poseDetect) {
  poseDetect = window.Monitor.poseDetect;
} else {
  new Error("没有找到poseDetect模块");
}

// 人脸搜索
import "./libs/faceSeeker.js";
let faceSeeker = null;
if (window.Monitor && window.Monitor.faceSeeker) {
  faceSeeker = window.Monitor.faceSeeker;
} else {
  new Error("没有找到faceSeeker模块");
}

// yolo算法
// import './libs/issueDetectorV2.js'
// let issueDetector = null
// if (window.Monitor && window.Monitor.issueDetector){
//   issueDetector = window.Monitor.issueDetector
// } else {
//   new Error('没有找到issueDector模块')
// }

// 活体检测-张嘴
import openMouth from "./actions/openMouth.js";
// 活体检测-摇头
import shakeHead from "./actions/shakeHead.js";
// 活体检测-举起左手
import raiseLeft from "./actions/raiseLeft.js";
// 视线检测
// import webgazer from './eyeTracing.js'

// 人脸识别 识别代码
export default class monitor {
  constructor(video, video2, callback) {
    this.finish = false;
    this.video = video2;
    this.video.style.position = "fixed";
    this.video.style.top = "-100%";
    this.video.style.left = "-100%";
    if (video.mozSrcObject !== undefined) {
      this.video.mozSrcObject = video.mozSrcObject;
    } else {
      this.video.srcObject = video.srcObject;
    }
    this.video.play().then(() => {
      // this.webcam = new Webcam(this.video)
    });
    this.callback = callback;
    this.log = false;
    this.tick = null;
    this.record = [];

    this.x = undefined;
    this.y = undefined;

    window.Monitor.callback = callback;
    window.Monitor.test = this.test;
    window.Monitor.record = this.record;

    // 视线检测 开始流程
    // webgazer.begin()
    //   .showPredictionPoints(true)
  }

  // 模型的准备 单例模式
  init = (() => {
    window.nobody = false;
    let loaded = false;
    return async cb => {
      if (!cb || typeof cb !== "function") return;

      if (loaded) return;

      // 人脸识别 加载模型
      await faceSeeker.init(this.video, cb);
      console.log("人脸识别模型加载完毕");

      // 姿态识别 加载模型
      await poseDetect.init(this.video, cb);
      console.log("姿态识别模型加载完毕");

      // yolo算法 加载模型
      // await issueDetector.init(this.video)
      // console.log('yolo算法模型加载完毕')

      // await woc(0)

      loaded = true;
    };
  })();

  // 一般的监考流程
  start = async () => {
    let index = 0;
    // let yoloStart = 0
    await this.init();
    console.log("监考开始");
    this.tick = () =>
      setTimeout(async () => {
        switch (index) {
          // case 0:
          //   yoloStart += 1
          //   if (yoloStart === 3) {
          //     yoloStart = 0
          //     window.startTime = Date.now()
          //     await issueDetector.detect(this.video)
          //     window.endTime = Date.now()
          //     console.log('yolo 用时')
          //     console.log((endTime - startTime)/1000)
          //     index += 1
          //     break
          //   }
          case 0:
            await poseDetect.multiDetect();
            index += 1;
            break;
          case 1:
            await faceSeeker.seek();
            index = 0;
            break;
        }
        if (this.finish) {
          return;
        }
        this.tick();
      }, 200);
    console.log("tick初始化完成");
    this.tick();
  };

  // 考前的活体检测流程
  active = async callback => {
    if (!callback || typeof callback != "function") {
      new Error("进行活体检测时没有传入正确的回调函数");
      return;
    }
    console.log("开始下载模型");
    await this.init();
    console.log("模型下载完成");
    callback(0);
    await openMouth(callback);
    callback(2);
    await shakeHead(callback);
    callback(4);
    await raiseLeft(callback);
    callback(6);
  };

  login = async (id, pic, password) => {
    this.log = true;
  };

  end = async () => {
    this.finish = true;
    return this.record;
  };

  test = () => {
    [100, 101, 102, 103, 104, 200, 201, 202, 203, 204].forEach(
      (item, index) => {
        setTimeout(() => {
          e(Math.floor(item / 100), item);
        }, 1000 * index);
      }
    );
  };

  pause = time => new Promise(res => setTimeout(res, time * 1000));
}

window.monitor = monitor;
window.Monitor.init = async () => {
  await faceSeeker.init();
  console.log("人脸识别模型加载完毕");
  await poseDetect.init();
  console.log("姿态识别模型加载完毕");
};
