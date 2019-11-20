import React from "react";
import { message, Alert, Modal, Steps } from "antd";
import "../style/monitor.css";
// import monitor from './index'

const { Step } = Steps;

export default class Monitor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Instance: null,
      currentStep: -1,
      percent: 0,
      percentStop: 25, //
      alertMessage: "开始张嘴检测，请张嘴",
      idModal: false,
      modal: null
    };
  }
  async componentDidMount() {
    const video = document.getElementById("video");
    const video2 = document.getElementById("face");

    if(this.props.active){
      let self = this;
      requestAnimationFrame(function funProgress() {
        if (self.state.percent < 100) {
          if (self.state.percent < self.state.percentStop) {
            self.setState(preState => {
              return { percent: preState.percent + 1 };
            });
          }
          requestAnimationFrame(funProgress);
        }
      });
    }

    try {
      this.state.Instance = new window.monitor(video, video2, (type, data) => {
        if(this.state.modal){
          this.state.modal.destroy();
        }
        switch (type) {
          case 0:
            console.log("检测到人脸");
            console.log(data.succes);
            if (!!data.success) {
              message.info("识别成功，监考系统将在后台持续监控！");
            } else {
              message.info("识别失败，请检查摄像头位置是否正常");
            }
            break;
          case 1:
            console.log("疑似违规", data.name);
            if (data.id === 100) {
              this.state.modal = Modal.error({
                title: "监考系统检测到您疑似犯规",
                content:
                  "监考系统检测到考试过程中您离开电脑前，出现无人脸的状态，请注意！"
              });
            } else {
              this.state.modal = Modal.warn({
                title: "监考系统检测到您疑似犯规",
                content:
                  "监考系统检测到考试过程中出现" + data.name + "， 请注意！"
              });
            }
            this.props.discoverCheating(data.time, data.id);
            break;
          case 2:
            console.log("确定犯规", data.name);
            if (data.id === 200) {
              this.state.modal = Modal.error({
                title: "监考系统检测到您犯规",
                content:
                  "监考系统检测到考试过程中您离开电脑前，出现无人脸的状态，请注意！"
              });
            } else {
              this.state.modal =  Modal.warn({
                title: "监考系统检测到您犯规",
                content:
                  "监考系统检测到考试过程中出现" + data.name + "， 请注意！"
              });
            }
            this.props.discoverCheating(data.time, data.id);
            break;
        }
      });
      await this.state.Instance.init((rate) => {
        //进度分为 1，2，3，4 个部分
        console.log(rate * 25)
        this.setState({
          percentStop: rate * 25
        });
      });
      

      if (this.props.active) {
        await this.state.Instance.active(type => {
          switch (type) {
            case 0:
              console.log("正在获取用户特征");
              this.setState(() => {
                return {
                  alertMessage: "正在获取用户特征，请正面面向屏幕保持正确的坐姿！"
                };
              });
              break;
            case 1:
              console.log("开始张嘴检测");
              this.setState(() => {
                return {
                  currentStep: 0,
                  alertMessage: "请张嘴！"
                };
              });
              break;
            case 2:
              console.log("张嘴检测完成");
              this.setState(() => {
                return {
                  currentStep: 1,
                  alertMessage: "开始摇头检测，请向左或者向右转头 45 度"
                };
              });
              break;
            case 3:
              console.log(
                "开始摇头检测 摇头 是指被检测者面对摄像头将头部向左或右转45度"
              );
              break;
            case 4:
              // console.log('摇头检测完成')
              this.setState(() => {
                return {
                  currentStep: 2,
                  alertMessage:
                    "开始动作检测，请将左手举起，使之在摄像头中的位置高过左肩"
                };
              });
              break;
            case 5:
              console.log(
                "开始动作检测 动作检测 是指用户将左手举起 使之在摄像头中的位置高过左肩"
              );
              break;
            case 6:
              console.log("动作检测完成");
              this.setState(() => {
                return { currentStep: 3 };
              });
              this.props.canGoNext();
              break;
          }
        });
        console.log("活体检测完成，开始考试");
      } else {
        // message.info(
        //   "已经开启 AI 监考，任何作弊行为都会在后台记录，请考生悉知！",
        //   10
        // );
        await this.state.Instance.start();
      }
    } catch (e) {
      console.log(e);
      console.log("error on calling camera");
    }
  }
  async componentWillUnmount() {
    try {
      const feedback = await this.state.Instance.end();
      console.log(feedback);
    } catch (e) {
      console.log(e);
    }
    this.state.Instance = null;
  }
  render() {
    // console.log('window.monitor', window.monitor)
    console.log("Monitor");
    let alertMessage = this.state.alertMessage;
    return (
      <div>
        {this.props.active && (
          <div style={{ width: "100%", fontSize: "14px" }}>
            {this.state.percent >= 100 ? (
              this.state.currentStep === 3 ? (
                <Alert
                  message="检测成功，点击下方按钮正式开始考试"
                  type="success"
                  style={{ textAlign: "center" }}
                />
              ) : (
                <div>
                  <Steps
                    current={this.state.currentStep}
                    style={{ textAlign: "left" }}
                  >
                    <Step title="张嘴检测" />
                    <Step title="摇头检测" />
                    <Step title="动作检测" />
                  </Steps>
                  <div style={{ marginTop: "10px" }}>{alertMessage}</div>
                </div>
              )
            ) : (
              <div className="monitor-progress-wrapper">
                <div
                  className="monitor-progress-bar"
                  style={{ width: this.state.percent + `%` }}
                ></div>
                <div style={{ position: "relative" }}>
                  正在下载人脸识别模型，请耐心等候 {this.state.percent} %
                </div>
              </div>
            )}
          </div>
        )}
        <div style={{ position: "fixed" }}>
          <video
            id="face"
            src=""
            height="416"
            width="416"
            muted
            style={{ visibility: "hidden" }}
          ></video>
        </div>
      </div>
    );
  }
}
