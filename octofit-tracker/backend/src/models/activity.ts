import mongoose, { Schema } from 'mongoose';

const activitySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, trim: true },
    duration: { type: Number, min: 0 },
    calories: { type: Number, min: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true, strict: false },
);

export default mongoose.model('Activity', activitySchema, 'activities');
