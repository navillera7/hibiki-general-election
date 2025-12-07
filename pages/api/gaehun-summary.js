// /pages/api/agenda-summary.js
import dbConnect from '@/lib/dbConnect';
import UserCode from '@/models/UserCode';

export default async function handler(req, res) {
  await dbConnect();

  const users = await UserCode.find({ Gaehunvote: { $exists: true } });
  const summary = {
    매우필요: 0,
    필요: 0,
    보통: 0,
    필요없음: 0,
    전혀필요없음: 0,
  };

  users.forEach(user => {
    if (user.Gaehunvote && summary[user.Gaehunvote] !== undefined) {
      summary[user.Gaehunvote]++;
    }
  });

  const result = Object.entries(summary).map(([id, count]) => ({ id, count }));

  res.status(200).json(result);
}
