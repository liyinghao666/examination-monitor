import '../libs/poseDetect.js'
const poseDetect = window.Monitor.poseDetect
let eyesDistance = undefined
let click = null
let pose = null
export default async function shakeHead(cb) {
  await new Promise(async (res) => {
    let tick = setInterval(async () => {
      pose = await poseDetect.detect()
      if (pose && pose.score > 0.3) {
        clearInterval(tick)
        res()
      }
    },1000)
  })
  eyesDistance = pose.keypoints[1].position.x - pose.keypoints[2].position.x
  // console.log('第一次检测双眼间距完成 '+ eyesDistance)
  cb(3)
  await new Promise((res) => {
    click = setInterval(async () => {    
      pose = await poseDetect.detect()
      // console.log(pose)
      // console.log(`本次检测双眼间距${pose.keypoints[1].position.x - pose.keypoints[2].position.x} 缩放比${(pose.keypoints[1].position.x - pose.keypoints[2].position.x)/eyesDistance}`)
      if((pose.keypoints[1].position.x - pose.keypoints[2].position.x) < eyesDistance * 0.8){
        clearInterval(click)
        res()
      }
    }, 500)
  })
}
