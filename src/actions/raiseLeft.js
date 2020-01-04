import "../libs/poseDetect";
const poseDetect = window.Monitor.poseDetect;
export default function openMouth(cb) {
  return new Promise(res => {
    cb(5);
    let tick = setInterval(async () => {
      let p = await poseDetect.detect();
      if (
        p &&
        p.score > 0.5 &&
        p.keypoints[9].position.y < p.keypoints[5].position.y
      ) {
        clearInterval(tick);
        res();
      }
    }, 300);
  });
}
