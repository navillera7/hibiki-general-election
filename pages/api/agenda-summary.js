// /pages/api/agenda-summary.js
import dbConnect from '@/lib/dbConnect';
import UserCode from '@/models/UserCode';

export default async function handler(req, res) {
  await dbConnect();

  const users = await UserCode.find({ agendaVote: { $exists: true } });

  const summary = {
    yes: 0,
    no: 0,
    abstain: 0,
  };

  users.forEach(user => {
    if (user.agendaVote && summary[user.agendaVote] !== undefined) {
      summary[user.agendaVote]++;
    }
  });

  const result = Object.entries(summary).map(([id, count]) => ({ id, count }));

  res.status(200).json(result);
}
