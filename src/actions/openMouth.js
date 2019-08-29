import '../libs/faceSeeker.js'
const faceSeeker = window.Monitor.faceSeeker
let dis = undefined
let face = null
export default async function openMouth () {
  for(;;) {
    if(!face) {
      face = await faceSeeker.seek()
    } else {
      break
    }
  }
  dis = face.landmarks.positions[57].y - face.landmarks.positions[62].y
  await new Promise((res) => {
    let tick = setInterval(async () => {
      let f = await faceSeeker.seek()
      if (f && f.landmarks.positions[57].y - f.landmarks.positions[62].y > 2 * dis) {
        clearInterval(tick)
        res()
      }
    }, 300);
  })
}