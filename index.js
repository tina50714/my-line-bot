// 處理事件的函數
const handleEvent = async (event) => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    console.log('非文字訊息，跳過');
    return Promise.resolve(null);
  }

  const userMessage = event.message.text.trim().toLowerCase(); // 小寫並去除空格
  const userId = event.source.userId;

  console.log(`收到訊息: ${userMessage}, 用戶ID: ${userId}`);

  // 檢查該用戶是否已經發送過訊息
  if (sentMessages.has(userId)) {
    console.log(`用戶 ${userId} 已經發送過訊息，跳過處理`);
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
    // 標記該用戶已經回應過
    sentMessages.add(userId);
    console.log(`標記用戶 ${userId} 已回應`);

    try {
      // 延遲發送訊息
      await new Promise((resolve) => setTimeout(resolve, 15000));
      
      console.log(`發送訊息給用戶 ${userId}: ${responses[userMessage]}`);
      await client.pushMessage(userId, {
        type: 'text',
        text: responses[userMessage]
      });
    } catch (error) {
      console.error('發送訊息錯誤:', error);
    } finally {
      // 發送完畢後清除標記
      sentMessages.delete(userId);
      console.log(`清除用戶 ${userId} 的標記`);
    }
  } else {
    console.log('無法辨識的訊息，回應錯誤');
    // 發送錯誤訊息回應給用戶
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
