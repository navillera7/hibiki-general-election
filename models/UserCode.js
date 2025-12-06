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
    enum: ['찬성', '반대'], // 여기 한글로 맞추기
    default: null,
  },
  Jungvote: {
    type: String,
    enum: ['매우잘함', '잘함', '보통', '못함', '매우못함'],
    default: null,
  },
  Leevote: {
    type: String,
    enum: ['매우잘함', '잘함', '보통', '못함', '매우못함'],
    default: null,
  },
  JungDownvote: {
    type: String,
    enum: ['매우필요' , '필요', '보통', '필요없음', '전혀필요없음'],
    default: null,  
  },
  Gaehunvote: {
    type: String,
    enum: ['매우필요' , '필요', '보통', '필요없음', '전혀필요d없음'],
    default: null,
  }
});


export default mongoose.models.UserCode || mongoose.model('UserCode', UserCodeSchema);


