import dbConnect from '@/lib/dbConnect';
import UserCode from '@/models/UserCode';

export default async function handler(req, res) {
  await dbConnect();

  const total = await UserCode.countDocuments();
  const voted = await UserCode.countDocuments({ voted: true });

  return res.status(200).json({
    total,
    voted,
    percentage: total > 0 ? ((voted / total) * 100).toFixed(1) : 0,
  });
}
