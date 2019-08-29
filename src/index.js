import { Webcam } from './helper/webcam.js'
import e from './helper/!.js'
// 人体姿态识别
import './builds/poseDetect.js'
let poseDetect = null
if (window.Monitor && window.Monitor.poseDetect){ 
  poseDetect = window.Monitor.poseDetect
} else {
  new Error('没有找到poseDetect模块')
}

// 人脸搜索
import './libs/faceSeeker.js'
let faceSeeker = null
if (window.Monitor && window.Monitor.faceSeeker){
  faceSeeker = window.Monitor.faceSeeker
} else {
  new Error('没有找到faceSeeker模块')
}

// yolo算法
import './libs/issueDetector.js'
let issueDetector = null
if (window.Monitor && window.Monitor.issueDetector){
  issueDetector = window.Monitor.issueDetector
} else {
  new Error('没有找到issueDector模块')
}

// 活体检测-摇头
import shakeHead from './actions/shakeHead.js'

// 视线检测
// import webgazer from './eyeTracing.js'


// 人脸识别 识别代码
export default class monitor {
  constructor(video, video2, callback) {
    // monitor init
    this.video = video2
    this.video.style.position = "fixed"
    this.video.style.top = "-100%"
    this.video.style.left = "-100%"
    if(video.mozSrcObject !== undefined){
      this.video.mozSrcObject = video.mozSrcObject
    }else{
      this.video.srcObject = video.srcObject 
    }
    this.video.play().then(() => {
      this.webcam = new Webcam(this.video)
    })
    this.callback = callback
    this.log = false
    this.tick = null
    this.record = []

    this.x = undefined
    this.y = undefined

    window.Monitor.callback = callback
    window.Monitor.test = this.test
    window.Monitor.record = this.record

    // 视线检测 开始流程
    // webgazer.begin()
    //   .showPredictionPoints(true)

  }

  // 模型的准备 单例模式
  init = (() => {
    let loaded = false
    return async () => {
      if (loaded)return

      console.log('在 Monitor 的 init 方法中加载模型数据')

      // 人脸识别 加载模型
      await faceSeeker.init(this.video)
      console.log('人脸识别模型加载完毕')

      // 姿态识别 加载模型
      await poseDetect.init(this.video)
      console.log('姿态识别模型加载完毕')

      // yolo算法 加载模型
      // await issueDetector.init(this.webcam)
      // console.log('yolo算法模型加载完毕')

      console.log('模型数据加载完成')

      // yolo算法 加载模型
      // this.model = await downloadModel()
      loaded = true
    }
  })()

  // 一般的监考流程
  start = async () => {
    await this.init()
    console.log('监考开始')
    // faceTracker(this.video, this.callback)
    this.tick = setInterval(async () => {
      // yolo算法 进行中
      // await faceDetect(this.webcam, this.model, this.callback)
      
      // 姿态检测 进行中
      let pose = await poseDetect.detect()
      console.log(pose)
      
      // 视线检测 进行中
      // await webgazer.detect(this.callback)
      
      // 人脸搜索
      let face = await faceSeeker.seek()

      // 人脸识别 识别中
      // rec(me, this.video)
    }, 500);
  }

  // 考前的活体检测流程
  active = async (callback) => {
    if(!callback || (typeof(callback) != 'function')) {
      new Error('进行活体检测时没有传入正确的回调函数')
      return
    }
    console.log('开始下载模型')
    await this.init()
    console.log('模型下载完成')
    console.log('开始摇头检测')
    await shakeHead()
    console.log('摇头检测完成')
    callback(0)
    callback(1)
    callback(2)
  }
  
  login = async (id, pic, password) => {
    this.log = true
  }

  end = async () => {
    clearInterval(this.tick);
    return this.record
    // webgazer.end();
  }

  test = () => {
    [100,101,102,103,104,200,201,202,203,204].forEach((item, index) => {
      setTimeout(() => {
        e(Math.floor(item/100), item)
      }, 1000 * index)
    })
  }
}
