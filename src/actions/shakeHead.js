import '../libs/poseDetect.js'
const poseDetect = window.Monitor.poseDetect
let eyesDistance = undefined
let pose = null
export default async function shakeHead(cb) {
  await new Promise(async (res) => {
    let tick = () => setTimeout(async () => {
      pose = await poseDetect.detect()
      if (pose && pose.score > 0.2) {
        res()
      } else {
        tick()
      }
    })
    tick()
  })
  eyesDistance = pose.keypoints[1].position.x - pose.keypoints[2].position.x
  // console.log('第一次检测双眼间距完成 '+ eyesDistance)
  cb(3)
  await new Promise((res) => {
    let click =  () => setTimeout(async () => {    
      pose = await poseDetect.detect()
      if((pose.keypoints[1].position.x - pose.keypoints[2].position.x) < eyesDistance * 0.8){
        res()
      } else {
        click()
      }
    })
    click()
  })
}
