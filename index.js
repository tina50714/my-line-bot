const express = require('express');
const line = require('@line/bot-sdk');
const path = require('path');

const app = express();


// LINE Bot 配置
const config = {
  channelAccessToken: '169LGu4yh9OIrZGJugmI/HlMXJf3utAg75WAORUnzr6sDa6Nsk88H5J0HUPf3oZ0Zpn9Z+axVRKs5XBXRJMtOZwNKbAQ1iGTK0uzHiie377hmEYY5QSPhTVyCurLpnVfWcTHFpBSKA36W2RDfRoABQdB04t89/1O/w1cDnyilFU=',  // 替換成你的 Channel Access Token
  channelSecret: '990e7aa76f3d5b60444924674e40cb8a'  // 替換成你的 Channel Secret
};

const client = new line.Client(config);

//提供LIFF靜態網頁
app.use(express.static(path.join(__dirname, 'public')));

// 處理事件的函數
const handleEvent = (event) => {
  // 檢查用戶發送的訊息是否是特定的關鍵字
  if (event.message.text === '觸發關鍵字') {
    // 使用 setTimeout 延遲 15 秒後回應
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        client.replyMessage(event.replyToken, {
          type: 'text',
          text: '這是你觸發關鍵字後，15 秒後回應的訊息！'
        })
        .then(resolve) // 回應成功後執行 resolve
        .catch(reject); // 回應失敗時執行 reject
      }, 15000);  // 15000 毫秒即為 15 秒
    });
  } 
  // 你可以添加其他的關鍵字和回應邏輯
  else if (event.message.text === '1-1') {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        client.replyMessage(event.replyToken, {
          type: 'text',
          text: '(warning)「1-1」穩定運送單 尚未完成!! '
        })
        .then(resolve) 
        .catch(reject); 
      }, 15000);
    });
  } 
  else {
    // 若發送的訊息不是觸發關鍵字，這裡可以選擇回應其他訊息
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: '請發送正確的關鍵字，或者「你好」！'
    });
  }
};

// Webhook 路由處理
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(() => res.status(200).send('OK'))  // 當事件處理成功時回應 OK
    .catch((err) => {  // 當出現錯誤時，回應 500
      console.error(err);
      res.status(500).end();
    });
});

// 啟動伺服器
app.listen(3000, () => {
  console.log('伺服器正在運行，端口：3000');
});
