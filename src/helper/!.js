const table = {
  100: '无人脸',
  101: '多人同屏',
  102: '眼神漂移',
  103: '违规物品',
  104: '大幅度肢体动作',
  
  200: '无人脸',
  201: '多人同屏',
  202: '眼神漂移',
  203: '违规物品',
  204: '大幅度肢体动作',
}

export default function e (type, id) {
  if(!window.Monitor)return
  if(!window.Monitor.callback) {
    console.log('没有合适的回调函数 报错模块无法工作')
    return
  }

  window.Monitor.record.push({
    time: Date.now(),
    name: table[id],
    id: id,
    type: type
  })
  
  window.Monitor.callback(type, {
    time: Date.now(),
    name: table[id],
    id: id
  })
}