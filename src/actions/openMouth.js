import '../libs/faceSeeker.js'
const faceSeeker = window.Monitor.faceSeeker
let dis = undefined
let face = null
export default async function openMouth (cb) {

  await new Promise((res) => {
    let tick = setInterval(async () => {
      face = await faceSeeker.seek()
      if (face) {
        clearInterval(tick)
        res()
      }
    },1000)
  })
  Monitor.face = face
  dis = face.landmarks.positions[57].y - face.landmarks.positions[62].y
  cb(1)
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