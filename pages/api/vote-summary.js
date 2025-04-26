import dbConnect from '@/lib/dbConnect';
import UserCode from '@/models/UserCode';

export default async function handler(req, res) {
  await dbConnect();

  const users = await UserCode.find({ voted: true });

  const counts = {};

  users.forEach(user => {
    const votes = user.votes || {};
    votes.forEach((numVotes, candidateId) => {
      if (typeof numVotes === 'number' && numVotes > 0) {
        counts[candidateId] = (counts[candidateId] || 0) + numVotes;
      }
    });
  });

  const resultArray = Object.keys(counts).map(key => ({
    id: key,
    count: counts[key]
  }));

  res.status(200).json(resultArray);
}
