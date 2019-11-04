import React from 'react';
import { message } from 'antd';
// import monitor from './index'

// let Instance = null

export default class Monitor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Instance: null
    }
  }
  componentDidMount() {
    const video = document.getElementById('video')
    const video2 = document.getElementById('face')
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        'audio': true,
        'video': { 'facingMode': "user" }
      }).then(async (mediaStream) => {
        if (video.mozSrcObject !== undefined) {
          video.mozSrcObject = mediaStream;
        } else {
          video.srcObject = mediaStream;
        }
        video.play()
        this.state.Instance = new window.monitor(video, video2, (type, data) => {
          switch (type) {
            case 0:
              console.log('检测到人脸')
              if (!!data.success) {
                message.info('识别成功，监考系统将在后台持续监控！')
              } else {
                message.info('识别失败，请检查摄像头位置是否正常')
              }
              break
            case 1:
              console.log('疑似违规', data.name)
              break
            case 2:
              console.log('确定犯规', data.name)
              message.info('监考系统检测到您', data.name, ' 请注意！')
              break
          }
          console.log(data)
        })

        message.info('正在下载模型，请稍候！', 10)
        await this.state.Instance.init()
        message.info('模型加载成功！')

        if (this.props.active) {
          await this.state.Instance.active((type) => {
            switch (type) {
              case 0:
                console.log('正在获取用户特征')
                break
              case 1:
                console.log('开始张嘴检测')
                message.info('开始张嘴检测，请张嘴', 4)
                break
              case 2:
                console.log('张嘴检测完成')
                break
              case 3:
                console.log('开始摇头检测 摇头 是指被检测者面对摄像头将头部向左或右转45度')
                message.info('开始摇头检测，请摇头，向左或者向右转 45 度', 4)
                break
              case 4:
                console.log('摇头检测完成')
                break
              case 5:
                console.log('开始动作检测 动作检测 是指用户将左手举起 使之在摄像头中的位置高过左肩')
                message.info('开始动作检测，请将左手举起 使之在摄像头中的位置高过左肩', 4)
                break
              case 6:
                console.log('动作检测完成')
                message.info('检测通过，点击按钮进入正式考试', 4)
                this.props.canGoNext()
                break
            }
          })
          console.log('活体检测完成，开始考试')
        } else {
          message.info('已经开启 AI 监考，任何作弊行为都会在后台记录，请考生悉知！', 6)
          await this.state.Instance.start()
        }
      }).catch((e) => {
        console.log('error on calling camera')
        console.log(e)
      })
    }
  }
  async componentWillUnmount() {
    const feedback = await this.state.Instance.end()
    console.log(feedback)
    this.state.Instance = null
  }
  render() {
    console.log('window.monitor', window.monitor)
    console.log('Monitor')
    return (
      <div style={{ position: "fixed" }}>
        <video
          id='face'
          src=''
          height="416"
          width="416"
          muted
          style={{ visibility: "hidden" }}
        ></video>
        {/* <script src="./index.js"></script> */}
      </div>
    )
  }
}