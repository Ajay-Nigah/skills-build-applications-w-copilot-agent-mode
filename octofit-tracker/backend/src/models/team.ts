import mongoose, { Schema } from 'mongoose';

const teamSchema = new Schema(
  {
    name: { type: String, trim: true },
    description: { type: String, trim: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    points: { type: Number, min: 0 },
  },
  { timestamps: true, strict: false },
);

export default mongoose.model('Team', teamSchema, 'teams');
