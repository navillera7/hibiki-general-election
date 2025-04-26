import dbConnect from '@/lib/dbConnect';
import UserCode from '@/models/UserCode';

export default async function handler(req, res) {
  await dbConnect();
  const { code } = req.body;

  const user = await UserCode.findOne({ code });
  if (!user) {
    return res.status(404).json({ success: false, message: '존재하지 않는 코드입니다.' });
  }

  if (user.voted) {
    return res.status(400).json({ success: false, message: '이미 투표를 완료한 코드입니다.' });
  }

  res.status(200).json({ success: true, code });
}