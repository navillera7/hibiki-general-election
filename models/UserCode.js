import mongoose from 'mongoose';

const UserCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  voted: { type: Boolean, default: false },
  votes: {
    type: Map,
    of: Number,
    default: {},
  },
  agendaVote: {
    type: String,
    enum: ['피바', '돌돔'],
    default: null,
  },
});


export default mongoose.models.UserCode || mongoose.model('UserCode', UserCodeSchema);

