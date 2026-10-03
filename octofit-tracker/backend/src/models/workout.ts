import mongoose, { Schema } from 'mongoose';

const workoutSchema = new Schema(
  {
    name: { type: String, trim: true },
    description: { type: String, trim: true },
    category: { type: String, trim: true },
    difficulty: { type: String, trim: true },
    duration: { type: Number, min: 0 },
  },
  { timestamps: true, strict: false },
);

export default mongoose.model('Workout', workoutSchema, 'workouts');
