#  监考系统前端文档

> 监考系统是为各类考试系统提供的一种远程无人监考解决方案，监考系统前端集成了`tensorflow.js`,`yolo.js`,`webgazer.js`，`posNet`等优秀的第三方智能算法库，力图为开发者提供开箱即用的开发体验

##  开始使用

```html
<script src="monitor.js">
```

```js
    const Instance = new monitor(video, video2, (type, data) => {
      switch (type) {
        case 0: console.log('检测到人脸')
        break
        case 1: 
        console.log('疑似违规')
        break
        case 2: console.log('违规实锤')  // 目前版本 不会触发 type的0或2类事件
        break
      }
      console.log(data)
    })

```



实例化需传入两个video引用

`video1`: 考试系统UI中的video元素。传入时，要确保`video`元素已经拿到摄像头的视频流并且调用过`video.play()`方法

`video2`: HTML元素，供`tensorflow.js`库使用。由于使用的算法中对计算张量的大小有要求，`video2`必须在元素内联样式写明宽高：`<video src="" width="416" height="416"></video>`。传入参数时无需对`video2`做额外处理

`callback`: 预先定义好的处理器函数，针对监考系统的各种返回值做出同步的响应。

* 登录监考系统后台

```js
await Instance.login(id, pic, password) // 目前版本 不需要
```

* 开始使用

```js
await Instance.init() // 推荐这样做 不过即便是忘记init  monitor会自己init 但由于init时间会比较长（模型总大小约50M）因此推荐使用init 同时对用户给出等待说明
await Instance.start()
```

在这一步中，监考系统会从网络上拉取必要的算法所需模型，这个过程需要的时间较长。

* 获取回执单

```js
const feedback = await Instance.end()
```

调用这个方法，停止监控并获取自`start`至`end`的监控记录。

##  处理器回调函数

处理器回调函数，指用户创建`monitor`对象时传入的用于对监考系统报警做出反应的回调函数`callback`

```js
const Instance = new monitor(video1, video2, callback)
```

`callback`函数在监考过程中会不断被调用，它应当具备以下形式：

```js
function callback(type, data) {
  switch(type) {
    case 0:
    break
    case 1:  // 当前版本 无人 多人 换人 异物 只会在这一类出现
    break
    case 2:
    break
  }
}
```

如你所见，每次监考系统调用回调函数，都会传入用户行为类型`type`与用户行为数据`data`两个参数，函数通过区别`type`来对用户行为作分类处理。

##  用户行为分类

如上所述，对回调函数的参数做详细介绍

* `type = 0` 监考系统进行人脸识别与定位


  ```js
  data = {
    success: boolean,		// 是否通过识别
    faceBox: {		        // 人脸位置
      left: number,
      top: number,
      width: number,
      height: number
    }
  }
  ```

* `type = 1` 用户行为被判定为疑似违规行为

  ```js
  data = {
    id: number,			// 违规行为唯一id
    name: string,			// 违规行为名称
    time: string,			// 违规发生时间
  }
  ```

* `type = 2` 用户行为被判定为确认违规行为

  ```js
  data = {
    id: number,			// 违规行为唯一id
    name: string,          // 违规行为名称
    time: string			// 违规发生时间
  }
  ```

* `id`  `name` 对照表

  * `type = 1`

    | id   | name                      | from        |
    | ---- | ------------------------- | ----------- |
    | 100  | 无人脸                    | yolo.js     |
    | 101  | 多人同屏                  | yolo.js     |
    | 102  | 眼神漂移                  | webgazer.js |
    | 103  | 检测到违规物品+违规物品名 | yolo.js     |
    | 104  | 有大幅度肢体动作          | posNet      |
    | 105  | 换人                      | face-api    |
    |      |                           |             |

  * `type = 2`

    | id   | name                       | from        |
    | ---- | -------------------------- | ----------- |
    | 200  | 无人脸超过20秒             | yolo.js     |
    | 201  | 多人同屏超过20秒           | yolo.js     |
    | 202  | 眼神漂移超过20秒           | webgazer.js |
    | 203  | 检测到同一违规物品超过20秒 | yolo.js     |
    | 204  | 频繁检测到大幅度肢体动作   | posNet      |
    | 205  | 换人                       | face-api    |
    |      |                            |             |

    以上数据格式为目前稳定可用的模块功能。在对接过程中，可以根据需要的功能另行扩展

##  活体检测

为了与考试系统相互配合，监考系统向外暴露`Monitor.active`异步调用函数，在正式考试之前对考生进行活体检测。调用形式如下：

```js
    await Instance.active((type) => {
      switch(type){
        case 0: console.log('正在获取用户特征')
        break
        case 1: console.log('开始张嘴检测')
        break
        case 2: console.log('张嘴检测完成')
        break
        case 3: console.log('开始摇头检测 摇头 是指被检测者面对摄像头将头部向左或右转45度')
        break
        case 4: console.log('摇头检测完成')
        break
        case 5: console.log('开始动作检测 动作检测 是指用户将左手举起 使之在摄像头中的位置高过左肩')
        break
        case 6: console.log('动作检测完成')
        break
      }
    })

```

考试系统调用此接口时，同样需要传入一个回调函数，监考系统将会按照顺序进行上述三个流程，并在每个流程结束时调用回调函数，以便考试系统在UI层给出提示

**这里要注意 考试系统给出的提醒最好在算法开始之后5秒 因为算法的初次调用会有一段时间的延迟 以后的版本会迭代解决这个问题**

##  回执单

调用`monitor.end()`获取到的监考全过程记录结构如下：

```js
feedback = [
  {
    time: string, 
    name: string,
    id: number,
    type: number
  },
  ...
]
```



##  文件夹中demo_.js是可供参考的示范  demo.js monitor.js 是已经打包过的代码 可以用http-server测试效果 models是模型文件 需要放在服务器根目录

##  异步的API设计

监考系统不是一个纯前端的解决方案，它需要与自己的后台进行交互，同时也可能会对其他算法提供的平台发起请求。为了简化开发者的工作，`Monitor`内部所有方法均为异步方法，统一采用`await`语法糖管理

##  自主地调用接口

到目前为止，我们所介绍的关于监考的功能都是以监考系统为上游，考试系统为下游的信息流处理。在某些情形下，考试系统需要自主调用监考系统的某一特定功能，比如在正式监考开始之前通过不断调用使得用户进入合适的监控范围，再比如生命特征检测所需要的某些功能，我们希望这些与UI密切相关而又不在监考流程之内的可选功能受考试系统自主控制，随时调用，因此下一步我们将为部分算法开放自主调用权限。

