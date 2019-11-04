export default function woc (id, content) {
  if(!window.worker) {
    console.log('没有发现可调用的线程')
  } else {
    return new Promise((res) => {
      console.log('向worker发出请求')
      window.worker.postMessage({
        id: id,
        content: content
      })
      window.worker.onmessage = (message) => {
        console.log('收到worker的回信')
        console.log(message)
        if (message.data.id === id) {
          res(message.data.content)
        }
      }
    })
  }
}

