// /pages/api/agenda-vote.js
import dbConnect from '@/lib/dbConnect';
import UserCode from '@/models/UserCode';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'POST 요청만 허용됩니다.' });
  }

  await dbConnect();

  const { code, vote } = req.body;

  if (!code || !vote) {
    return res.status(400).json({ success: false, message: '코드 또는 투표 항목이 누락되었습니다.' });
  }

  const user = await UserCode.findOne({ code });

  if (!user) {
    return res.status(404).json({ success: false, message: '유효하지 않은 코드입니다.' });
  }

  if (user.agendaVote) {
    return res.status(400).json({ success: false, message: '이미 투표를 완료했습니다.' });
  }

  user.agendaVote = vote;
  await user.save();

  return res.status(200).json({ success: true });
}
