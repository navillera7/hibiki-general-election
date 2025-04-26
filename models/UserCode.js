import mongoose from 'mongoose';

const userCodeSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  voted: { type: Boolean, default: false },
  votes: {
    type: Map,
    of: Number,
    default: {},
  },
});

export default mongoose.models.UserCode || mongoose.model('UserCode', userCodeSchema);
