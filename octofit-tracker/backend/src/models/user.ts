import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: { type: String, trim: true },
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  },
  { timestamps: true, strict: false },
);

export default mongoose.model('User', userSchema, 'users');
