require('dotenv').config();
console.log('ACCESS TOKEN 測試:', process.env.LINE_CHANNEL_ACCESS_TOKEN);


// 打印所有環境變數，幫助確定 .env 檔案是否正確加載
console.log('環境變數:', process.env);

// 打印出單獨的 LINE_CHANNEL_ACCESS_TOKEN
console.log('LINE_CHANNEL_ACCESS_TOKEN:', process.env.LINE_CHANNEL_ACCESS_TOKEN);

const line = require('@line/bot-sdk');
const express = require('express');

const path = require('path');

const app = express();

// 靜態資源路徑 (重要)
app.use(express.static(path.join(__dirname, 'public')));

// LINE Bot 配置
console.log('LINE_CHANNEL_ACCESS_TOKEN:', process.env.LINE_CHANNEL_ACCESS_TOKEN);
console.log('LINE_CHANNEL_SECRET:', process.env.LINE_CHANNEL_SECRET);

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

if (!config.channelAccessToken) {
  throw new Error("no channel access token");
}

if (!config.channelSecret) {
  throw new Error("no channel secret");
}

const client = new line.Client(config);


// 用來記錄已回應訊息的用戶 ID
const sentMessages = new Map();

// 預設首頁 (可有可無)
app.get('/', (req, res) => {
  res.send('LIFF Server is running');
});

// LIFF 測試頁 (非必要)
app.get('/liff/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Webhook 路由處理
app.post('/webhook', express.json(), async (req, res) => {
  try {
    const events = req.body.events;
    await Promise.all(events.map(handleEvent));
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook 錯誤:', error);
    res.status(500).send('發生錯誤');
  }
});
    // 從請求中提取 keyword 參數
    const { keyword } = req.body;

// 處理 LINE Bot 事件
const handleEvent = async (event) => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userMessage = event.message.text;
  const userId = event.source.userId;

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

  if (responses[userMessage]) {
    if (sentMessages.has(userId) && sentMessages.get(userId) === userMessage) {
      console.log(`用戶 ${userId} 已回應，跳過`);
      return;
    }

    setTimeout(async () => {
      try {
        await client.pushMessage(userId, {
          type: 'text',
          text: responses[userMessage]
        });

        sentMessages.set(userId, userMessage);
        console.log(`已回應 ${userId}: ${responses[userMessage]}`);

      } catch (error) {
        console.error('推送失敗', error);
      }
    }, 15000);
  } else {
    await client.replyMessage(event.replyToken, {
      type: 'text',
      text: '我看不懂你想表達什麼❓️請輸入正確關鍵字❗️'
    });
  }
};

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`伺服器運行中, Port: ${port}`);
});
