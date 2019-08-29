import monitor from './index'
const video = document.querySelector('#video')
const video2 = document.querySelector('#face')
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({
    'audio':true,
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
        case 0: console.log('摇头检测完成')
      }
    })
    console.log('活体检测完成，开始考试')
    await Monitor.start()
    setTimeout(() => {
      console.log(Monitor.end())
    }, 1000*20)
  }).catch((e) => {
    console.log('error on calling camera')
    console.log(e)
  })
}
