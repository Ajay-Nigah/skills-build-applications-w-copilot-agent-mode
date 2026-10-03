import mongoose, { Schema } from 'mongoose';

const leaderboardSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
    points: { type: Number, min: 0, default: 0 },
    rank: { type: Number, min: 1 },
  },
  { timestamps: true, strict: false },
);

export default mongoose.model('Leaderboard', leaderboardSchema, 'leaderboard');
