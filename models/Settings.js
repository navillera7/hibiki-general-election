import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  votingClosed: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
