let userName = '' //用於儲存使用者名稱

//設定Socket連線的配置，配置內容為連線至本地端的port:3001，並關閉自動連線
const socket = io('localhost:3000', { autoConnect: false })

function init() {
  //Step1:取得index.html中的元件
  const title = document.getElementById('title')
  const form = document.getElementById('form')
  const input = document.getElementById('input')

  //Step2:顯示輸入框讓使用者輸入名稱，並修改標題內容
  userName = prompt('請輸入你的名稱')
  if (!userName || userName == '') {
    title.textContent = '請重新載入網頁並輸入你的名稱'
    return
  } else {
    title.textContent = `Hi, ${userName}, 歡迎來到WebSocket聊天室`
  }

  //Step3:設定元件的監聽事件
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    if (input.value && socket.connected) {
      socket.emit('message', userName, input.value) //發送message事件，以發送訊息
      input.value = '' //清空輸入的訊息內容
    }
  })

  //Step4:設定Socket的監聽事件
  socket.on('connect', () => {
    //成功連線至Socket Server後，進入此監聽事件
    socket.emit('join', userName) //發送join事件，以加入聊天室
  })

  socket.on('new member', (name) => {
    //當有新成員加入聊天室後，進入此監聽事件
    showMsg(`【${name} 進入聊天室】`) //顯示新成員進入聊天室的訊息
  })

  socket.on('new message', (name, msg) => {
    //當有新訊息後，進入此監聽事件
    showMsg(`${name} 說：${msg}`) //顯示新訊息
  })

  socket.on('member leave', (name) => {
    //當有成員離開聊天室後，進入此監聽事件
    showMsg(`【${name} 離開聊天室】`) //顯示成員離開聊天室的訊息
  })

  //Step5:連線至Socket Server
  socket.connect()
}

function showMsg(text) {
  //建立用於顯示訊息的清單項目元件
  const item = document.createElement('li')
  item.textContent = text
  //將清單項目元件呈現於訊息列表
  const messages = document.getElementById('messages')
  messages.appendChild(item)
  //滾動置底
  window.scrollTo(0, document.body.scrollHeight)
}

init()
