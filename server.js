const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const port = 3002;

const cors = require('cors');
// 解析JSON请求体
app.use(cors());
app.use(express.json());

// 创建Nodemailer传输配置（需用户自行填写邮箱配置）
let transporter = nodemailer.createTransport({
  service: '163', // 如使用163邮箱
  auth: {
    user: '18220748090@163.com', // 替换为你的163邮箱账号（注意：请替换为实际邮箱账号）
    pass: 'GUw9h3AtwZPdEREH' // 替换为你的163邮箱授权码（非登录密码）
  }
});

// 邮件发送接口
app.post('/api/send-email', async (req, res) => {
  const { productName, quantity, address, phone, to, name } = req.body;
console.log('接收到的订单参数：', req.body);

  // 构建邮件内容
  const mailOptions = {
    from: '18220748090@163.com', // 发件人邮箱（实际邮箱账号）
    to: '2409455870@qq.com', // 固定收件人邮箱为2409455870@qq.com
    subject: '新的皮影购买订单通知',
    text: `商品名称：${productName}\n购买数量：${quantity}\n收货地址：${address}\n联系电话：${phone}\n客户姓名：${name}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: '邮件发送成功' });
  } catch (error) {
    res.status(500).json({ error: '邮件发送失败：' + error.message });
  }
});

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});