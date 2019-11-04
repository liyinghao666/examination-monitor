const table = {
  100: '无人脸',
  101: '多人同屏',
  102: '眼神漂移',
  103: '违规物品',
  104: '大幅度肢体动作',
  105: '换人',
  
  
  200: '无人脸',
  201: '多人同屏',
  202: '眼神漂移',
  203: '违规物品',
  204: '大幅度肢体动作',
  205: '换人'
}

export default function e (type, id, issue) {
  if(!window.Monitor)return
  if(!window.Monitor.callback) {
    console.log('没有合适的回调函数 报错模块无法工作')
    return
  }

  console.log('监考系统提醒：')
  console.log(table[id])

  if(!window.Monitor.record)window.Monitor.record = []
  window.Monitor.record.push({
    time: Date.now(),
    name: `${issue ? '违规物品:' + issue : table[id]}`,
    id: id,
    type: type
  })
  
  window.Monitor.callback(type, {
    time: Date.now(),
    name: `${issue ? '违规物品:' + issue : table[id]}`,
    id: id
  })
}