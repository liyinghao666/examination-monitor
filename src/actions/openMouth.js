import faceSeeker from "../libs/faceSeeker.js";

let dis;
let face;

export default async function openMouth(cb) {
  await new Promise(res => {
    let tick = () =>
      setTimeout(async () => {
        face = await faceSeeker.seek();
        // console.log('tick tick boom')
        if (face) {
          res();
        } else {
          tick();
        }
      });
    tick();
  });
  Monitor.face = face;
  dis = face?.landmarks?.positions[57]?.y - face?.landmarks?.positions[62]?.y;
  cb(1);
  await new Promise(res => {
    let tick = () =>
      setTimeout(async () => {
        let f = await faceSeeker.seek();
        if (
          f?.landmarks?.positions[57]?.y - f?.landmarks?.positions[62]?.y >
          2 * dis
        ) {
          res();
        } else {
          tick();
        }
      });
    tick();
  });
}
