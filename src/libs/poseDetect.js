import * as posenet from "@tensorflow-models/posenet";
import e from "../helper/!.js";
const imageScaleFactor = 0.5;
const outputStride = 16;
const flipHorizontal = false;
let net = null;
let Pose = null;
let video = null;

async function init(imageElement, cb) {
  net = await posenet.load({
    architecture: "MobileNetV1",
    outputStride: 16,
    inputResolution: 513,
    multiplier: 0.75
  });
  if (cb && typeof cb === "function") {
    cb(4);
  }
  video = imageElement ? imageElement : video;
}

async function multiDetect(v = video) {
  let multi = 0;
  let scores = [];
  let top = 0;
  const poses = await net.estimateMultiplePoses(
    v,
    imageScaleFactor,
    false,
    16,
    2
  );
  poses.forEach(pose => {
    top > pose.score ? null : (top = pose.score);
    if (pose.score > 0.25) {
      multi += 1;
      scores.push(pose.score);
    }
  });
  if (multi === 0 && !window.nobody) {
    window.nobody = true;
    e(1, 100);
  } else if (multi >= 2) {
    let ensure = 0;
    scores.forEach(item => {
      if (item >= top - 0.1) {
        ensure += 1;
      }
    });
    if (ensure >= 2) e(1, 101);
  } else {
    window.nobody = false;
  }
}

async function detect(v = video) {
  if (!v) {
    new Error("没有合适的图像载体");
    return;
  }
  const pose = await net.estimateSinglePose(
    v,
    imageScaleFactor,
    flipHorizontal,
    outputStride
  );
  Pose = pose;
  return Pose;
}

function getPose() {
  return Pose;
}

const poseDetect = {
  init,
  detect,
  multiDetect,
  getPose
};
if (window.Monitor) {
  window.Monitor.poseDetect = poseDetect;
} else {
  window.Monitor = {
    poseDetect
  };
}

export default poseDetect;
