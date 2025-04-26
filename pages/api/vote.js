import dbConnect from '@/lib/dbConnect';
import UserCode from '@/models/UserCode';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'POST 요청만 허용됩니다.' });
  }

  await dbConnect();

  const { code, votes } = req.body;

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  if (!code || !votes || typeof votes !== 'object' || totalVotes !== 3) {
    return res.status(400).json({ success: false, message: '정확히 3표를 사용해야 합니다.' });
  }

  const user = await UserCode.findOne({ code });

  if (!user) {
    return res.status(404).json({ success: false, message: '존재하지 않는 코드입니다.' });
  }

  if (user.voted) {
    return res.status(400).json({ success: false, message: '이미 투표 완료한 코드입니다.' });
  }

  user.votes = votes;
  user.voted = true;
  await user.save();

  return res.status(200).json({ success: true });
}
