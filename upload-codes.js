require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const UserCode = require('./models/codeupload.js');

// 1. MongoDB Atlas 연결
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('📡 MongoDB Atlas 연결 성공');
  uploadCodes();
})
.catch(err => {
  console.error('❌ MongoDB 연결 실패:', err);
  process.exit(1);
});

// 2. 코드 업로드 함수
async function uploadCodes() {
  try {
    const filePath = path.join(__dirname, 'codes.json');
    const rawData = fs.readFileSync(filePath);
    const codes = JSON.parse(rawData);

    await UserCode.insertMany(codes);
    console.log(`✅ ${codes.length}개의 코드가 MongoDB에 업로드되었습니다.`);
    process.exit();
  } catch (err) {
    console.error('업로드 중 오류 발생:', err);
    process.exit(1);
  }
}