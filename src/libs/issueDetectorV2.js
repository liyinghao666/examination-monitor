import * as yolo from "tfjs-tiny-yolov2";
import e from "../helper/warning.js";

let net = null;
const forwardParams = {
  inputSize: 416,
  scoreThreshold: 0.6
};
const leastParams = {
  inputSize: 416,
  scoreThreshold: 0.2
};
const detect = async video => {
  let boxes = await net.detect(video, forwardParams);
  let issue = new Set(); // 违规物品名称表
  let muti = 0;
  let cheat = false;
  boxes.forEach(box => {
    if (box.className === "cell phone" || box.className === "book") {
      issue.add(box.className);
      cheat = true;
    }
    if (box.className === "person") {
      muti += 1;
    }
  });
  if (muti === 0) {
    let boxes = await net.detect(video, leastParams);
    boxes.forEach(box => {
      if (box.className === "person") {
        muti += 1;
      }
    });
    if (muti === 0 && !window.nobody) {
      window.nobody = true;
      e(1, 100);
    }
  } else if (muti === 1) {
    window.nobody = false;
    Monitor.shakalaka.push(0);
    Monitor.shakalaka.shift();
  } else if (muti > 1) {
    window.nobody = false;
    Monitor.shakalaka.push(0);
    Monitor.shakalaka.shift();
    e(1, 101);
  }

  if (cheat) {
    e(1, 103, Array.from(issue).join(","));
  }
};

const init = async () => {
  net = new yolo.TinyYolov2({
    withSeparableConvs: false,
    iouThreshold: 0.4,
    anchors: [
      { x: 0.57, y: 0.68 },
      { x: 1.87, y: 2.06 },
      { x: 3.34, y: 5.47 },
      { x: 7.88, y: 3.53 },
      { x: 9.77, y: 9.17 }
    ],
    classes: [
      "person",
      "bicycle",
      "car",
      "motorbike",
      "aeroplane",
      "bus",
      "train",
      "truck",
      "boat",
      "traffic light",
      "fire hydrant",
      "stop sign",
      "parking meter",
      "bench",
      "bird",
      "cat",
      "dog",
      "horse",
      "sheep",
      "cow",
      "elephant",
      "bear",
      "zebra",
      "giraffe",
      "backpack",
      "umbrella",
      "handbag",
      "tie",
      "suitcase",
      "frisbee",
      "skis",
      "snowboard",
      "sports ball",
      "kite",
      "baseball bat",
      "baseball glove",
      "skateboard",
      "surfboard",
      "tennis racket",
      "bottle",
      "wine glass",
      "cup",
      "fork",
      "knife",
      "spoon",
      "bowl",
      "banana",
      "apple",
      "sandwich",
      "orange",
      "broccoli",
      "carrot",
      "hot dog",
      "pizza",
      "donut",
      "cake",
      "chair",
      "sofa",
      "pottedplant",
      "bed",
      "diningtable",
      "toilet",
      "tvmonitor",
      "laptop",
      "mouse",
      "remote",
      "keyboard",
      "cell phone",
      "microwave",
      "oven",
      "toaster",
      "sink",
      "refrigerator",
      "book",
      "clock",
      "vase",
      "scissors",
      "teddy bear",
      "hair drier",
      "toothbrush"
    ]
  });
  await net.load(
    `https://exam-test.cecctm.com/static/js_models/coco_model-weights_manifest.json`
  );
};

const issueDetector = {
  init,
  detect
};

if (window.Monitor) {
  window.Monitor.issueDetector = issueDetector;
} else {
  window.Monitor = {
    issueDetector
  };
}

export default issueDetector;
