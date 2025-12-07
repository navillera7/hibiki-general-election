// /pages/api/agenda-summary.js
import dbConnect from '@/lib/dbConnect';
import UserCode from '@/models/UserCode';

export default async function handler(req, res) {
  await dbConnect();

  const users = await UserCode.find({ Leevote: { $exists: true } });

  const summary = {
    매우잘함: 0,
    잘함: 0,
    보통: 0,
    못함: 0,
    매우못함: 0,
  };

  users.forEach(user => {
    if (user.Leevote && summary[user.Leevote] !== undefined) {
      summary[user.Leevote]++;
    }
  });

  const result = Object.entries(summary).map(([id, count]) => ({ id, count }));

  res.status(200).json(result);
}
