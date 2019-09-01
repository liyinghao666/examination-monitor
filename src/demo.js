// import monitor from './index'
const video = document.querySelector('#video')
const video2 = document.querySelector('#face')
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({
    'audio':false,
    'video':{'facingMode': "user"}
  }).then(async(mediaStream) => {
    if(video.mozSrcObject !== undefined){
      video.mozSrcObject = mediaStream;
    }else{
      video.srcObject = mediaStream;                
    }
    video.play()

    const Monitor = new monitor(video, video2, (type, data) => {
      switch (type) {
        case 0: console.log('检测到人脸')
        break
        case 1: 
        console.log('疑似违规')
        break
        case 2: console.log('违规实锤')
        break
      }
      console.log(data)
    })
    
    
    await Monitor.active((type) => {
      switch(type){
        case 0: console.log('正在获取用户特征')
        break
        case 1: console.log('开始张嘴检测')
        break
        case 2: console.log('张嘴检测完成')
        break
        case 3: console.log('开始摇头检测 摇头 是指被检测者面对摄像头将头部向左或右转45度')
        break
        case 4: console.log('摇头检测完成')
        break
        case 5: console.log('开始动作检测 动作检测 是指用户将左手举起 使之在摄像头中的位置高过左肩')
        break
        case 6: console.log('动作检测完成')
        break
      }
    })
    console.log('活体检测完成，开始考试')
    
    await Monitor.start()
    
    // setTimeout(async () => {
    //   await Monitor.end()
    // }, 1000*10)
  }).catch((e) => {
    console.log('error on calling camera')
    console.log(e)
  })
}
