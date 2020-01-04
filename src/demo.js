const video = document.querySelector("#video");
const video2 = document.querySelector("#face");
const message = document.querySelector("#message");

const log = console.log;
const logs = [];
console.log = (...params) => {
  log(...params);
  logs.push(params.join(" "));
  message.innerText = logs.join("\n");
  message.scrollTop = message.scrollHeight;
};

if (navigator?.mediaDevices?.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: { facingMode: "user" }
    })
    .then(async mediaStream => {
      if (video.mozSrcObject !== undefined) {
        video.mozSrcObject = mediaStream;
      } else {
        video.srcObject = mediaStream;
      }
      video.play();
      const FMonitor = new monitor(video, video2, (type, data) => {
        switch (type) {
          case 0:
            console.log("检测到人脸");
            if (data.success) {
              console.log("识别成功，监考系统将在后台持续监控！");
            } else {
              console.log("识别失败，请检查摄像头位置是否正常");
            }
            break;
          case 1:
            console.log("疑似违规", data.name);
            break;
          case 2:
            console.log("违规实锤", data.name);
            console.log("监考系统检测到您", data.name, " 请注意！");
            break;
        }
      });
      await FMonitor.init(type => {
        console.log(`init ${type}`);
      });
      await FMonitor.active(type => {
        switch (type) {
          case 0:
            console.log("正在获取用户特征");
            break;
          case 1:
            console.log("开始张嘴检测");
            break;
          case 2:
            console.log("张嘴检测完成");
            break;
          case 3:
            console.log(
              "开始摇头检测 摇头 是指被检测者面对摄像头将头部向左或右转45度"
            );
            break;
          case 4:
            console.log("摇头检测完成");
            break;
          case 5:
            console.log(
              "开始动作检测 动作检测 是指用户将左手举起 使之在摄像头中的位置高过左肩"
            );
            break;
          case 6:
            console.log("动作检测完成");
            break;
        }
      });
      await FMonitor.start();
      console.log("活体检测完成，开始考试");
    })
    .catch(e => {
      console.log("error on calling camera");
      console.log(e);
    });
}
