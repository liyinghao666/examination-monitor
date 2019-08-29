import '../builds/poseDetect.js'
const poseDetect = window.Monitor.poseDetect
let eyesDistance = undefined
let click = null
let shake = 0
export default async function shakeHead() {
  let pose = await poseDetect.detect()
  eyesDistance = pose.keypoints[1].position.x - pose.keypoints[2].position.x
  console.log('第一次检测双眼间距完成 '+ eyesDistance)
  await new Promise((res) => {
    click = setInterval(async () => {    
      pose = await poseDetect.detect()
      console.log(pose)
      console.log(`本次检测双眼间距${pose.keypoints[1].position.x - pose.keypoints[2].position.x} 缩放比${(pose.keypoints[1].position.x - pose.keypoints[2].position.x)/eyesDistance}`)
      if((pose.keypoints[1].position.x - pose.keypoints[2].position.x) < eyesDistance * 0.75){
        shake += 1
        if(shake === 2) {
          clearInterval(click)
          res()
        }
      }
    }, 500)
  })
}
