const express = require('express');
const line = require('@line/bot-sdk');
const path = require('path');

const app = express();

// LINE Bot 配置
const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,  // 從環境變數讀取
  channelSecret: process.env.LINE_SECRET  // 從環境變數讀取
};

const client = new line.Client(config);

// 提供 LIFF 靜態網頁
app.use(express.static(path.join(__dirname, 'public')));

// 用來記錄已發送訊息的用戶 ID
const sentMessages = new Set(); // 用 Set 儲存已回應的用戶 ID

// 處理事件的函數
const handleEvent = async (event) => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userMessage = event.message.text;
  const userId = event.source.userId;

  // 檢查該用戶是否已經發送過訊息
  if (sentMessages.has(userId)) {
    console.log(`用戶 ${userId} 已經收到過回應，跳過處理`);
    return; // 如果已經回應過，就不再處理
  }

  // 使用物件來存放關鍵字對應的回應
  const responses = {
    "1-1": "⚠️「1-1」穩定運送單 請確認是否完成!!⚠️",
    "1-2": "⚠️「1-2」穩定運送單 請確認是否完成!!⚠️",
    "1-3": "⚠️「1-3」穩定運送單 請確認是否完成!!⚠️",
    "2-1": "⚠️「2-1」穩定運送單 請確認是否完成!!⚠️",
    "2-2": "⚠️「2-2」穩定運送單 請確認是否完成!!⚠️",
    "2-3": "⚠️「2-3」穩定運送單 請確認是否完成!!⚠️",
    "03": "⚠️「03」穩定運送單 請確認是否完成!!⚠️",
    "05": "⚠️「05」穩定運送單 請確認是否完成!!⚠️",
    "06": "⚠️「06」穩定運送單 請確認是否完成!!⚠️",
    "7-1": "⚠️「7-1」穩定運送單 請確認是否完成!!⚠️",
    "7-2": "⚠️「7-2」穩定運送單 請確認是否完成!!⚠️",
    "8-1": "⚠️「8-1」穩定運送單 請確認是否完成!!⚠️",
    "8-2": "⚠️「8-2」穩定運送單 請確認是否完成!!⚠️",
    "9-1": "⚠️「9-1」穩定運送單 請確認是否完成!!⚠️",
    "9-2": "⚠️「9-2」穩定運送單 請確認是否完成!!⚠️",
    "10-1": "⚠️「10-1」穩定運送單 請確認是否完成!!⚠️",
    "10-2": "⚠️「10-2」穩定運送單 請確認是否完成!!⚠️",
    "11-1": "⚠️「11-1」穩定運送單 請確認是否完成!!⚠️",
    "11-2": "⚠️「11-2」穩定運送單 請確認是否完成!!⚠️",
    "12-1": "⚠️「12-1」穩定運送單 請確認是否完成!!⚠️",
    "12-2": "⚠️「12-2」穩定運送單 請確認是否完成!!⚠️",
    "13-1": "⚠️「13-1」穩定運送單 請確認是否完成!!⚠️",
    "13-2": "⚠️「13-2」穩定運送單 請確認是否完成!!⚠️",
    "15": "⚠️「15」穩定運送單 請確認是否完成!!⚠️",
    "16": "⚠️「16」穩定運送單 請確認是否完成!!⚠️",
    "17": "⚠️「17」穩定運送單 請確認是否完成!!⚠️",
    "18-1": "⚠️「18-1」穩定運送單 請確認是否完成!!⚠️",
    "18-2": "⚠️「18-2」穩定運送單 請確認是否完成!!⚠️",
    "18-3": "⚠️「18-3」穩定運送單 請確認是否完成!!⚠️",
    "19-1": "⚠️「19-1」穩定運送單 請確認是否完成!!⚠️",
    "19-2": "⚠️「19-2」穩定運送單 請確認是否完成!!⚠️",
    "19-3": "⚠️「19-3」穩定運送單 請確認是否完成!!⚠️",
    "20": "⚠️「20」穩定運送單 請確認是否完成!!⚠️"
  };

  // 檢查關鍵字是否存在
  if (responses[userMessage]) {
    sentMessages.add(userId);  // 標記該用戶已經回應過
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          await client.pushMessage(userId, {
            type: 'text',
            text: responses[userMessage]
          });
        } catch (error) {
          console.error(error);
        } finally {
          sentMessages.delete(userId); // 回應後，移除標記
          resolve();
        }
      }, 15000); // 延遲 15 秒再發送回應
    });
  } else {
    // 用戶輸入的不是預定關鍵字
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: '我看不懂你想表達什麼❓️請輸入正確關鍵字❗️'
    });
  }
};

// Webhook 路由處理
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(() => res.status(200).send('OK')) // 當事件處理成功時回應 OK
    .catch((err) => { // 當出現錯誤時，回應 500
      console.error(err);
      res.status(500).end();
    });
});

// 啟動伺服器
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`伺服器正在運行，端口：${port}`);
});
