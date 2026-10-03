import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import Activity from '../models/activity';
import Leaderboard from '../models/leaderboard';
import Team from '../models/team';
import User from '../models/user';
import Workout from '../models/workout';

function requireRecord<T>(record: T | null, collection: string): T {
  if (!record) {
    throw new Error(`Could not save seeded ${collection} record`);
  }
  return record;
}

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    console.log('Seed the octofit_db database with test data');
    await connectDatabase();

    const teamSeed = [
      { name: 'Trail Blazers', description: 'Outdoor miles and weekend adventures', points: 0 },
      { name: 'Pulse Pioneers', description: 'Building strength one session at a time', points: 0 },
    ];
    const teams = await Promise.all(
      teamSeed.map(async (team) => {
        const existing = await Team.findOne({ name: team.name });
        return existing
          ? Team.findByIdAndUpdate(existing._id, { $set: team }, { new: true, runValidators: true })
          : Team.create(team);
      }),
    );
    const [trailBlazers, pulsePioneers] = teams.map((team) => requireRecord(team, 'team'));

    const userSeed = [
      { username: 'maya.chen', name: 'Maya Chen', email: 'maya.chen@example.com', teamId: trailBlazers._id },
      { username: 'liam.patel', name: 'Liam Patel', email: 'liam.patel@example.com', teamId: trailBlazers._id },
      { username: 'sofia.reyes', name: 'Sofia Reyes', email: 'sofia.reyes@example.com', teamId: pulsePioneers._id },
      { username: 'noah.williams', name: 'Noah Williams', email: 'noah.williams@example.com', teamId: pulsePioneers._id },
    ];
    const seededUsers = await Promise.all(
      userSeed.map(async (user) => {
        const existing = await User.findOne({ email: user.email });
        return existing
          ? User.findByIdAndUpdate(existing._id, { $set: user }, { new: true, runValidators: true })
          : User.create(user);
      }),
    );
    const users = seededUsers.map((user) => requireRecord(user, 'user'));

    await Promise.all([
      Team.findByIdAndUpdate(trailBlazers._id, { $set: { members: users.slice(0, 2).map((user) => user._id), points: 1870 } }),
      Team.findByIdAndUpdate(pulsePioneers._id, { $set: { members: users.slice(2).map((user) => user._id), points: 1600 } }),
    ]);

    const activities = [
      { seedKey: 'maya-run-1', userId: users[0]._id, type: 'running', duration: 35, calories: 310, date: new Date('2026-09-28T07:30:00Z') },
      { seedKey: 'maya-yoga-1', userId: users[0]._id, type: 'yoga', duration: 45, calories: 180, date: new Date('2026-09-30T17:00:00Z') },
      { seedKey: 'liam-cycle-1', userId: users[1]._id, type: 'cycling', duration: 50, calories: 420, date: new Date('2026-09-29T06:45:00Z') },
      { seedKey: 'liam-strength-1', userId: users[1]._id, type: 'strength', duration: 40, calories: 260, date: new Date('2026-10-01T18:00:00Z') },
      { seedKey: 'sofia-run-1', userId: users[2]._id, type: 'running', duration: 28, calories: 245, date: new Date('2026-09-28T08:00:00Z') },
      { seedKey: 'sofia-strength-1', userId: users[2]._id, type: 'strength', duration: 55, calories: 360, date: new Date('2026-10-01T16:30:00Z') },
      { seedKey: 'noah-walk-1', userId: users[3]._id, type: 'walking', duration: 60, calories: 230, date: new Date('2026-09-30T12:00:00Z') },
      { seedKey: 'noah-cycle-1', userId: users[3]._id, type: 'cycling', duration: 42, calories: 350, date: new Date('2026-10-02T07:00:00Z') },
    ];
    await Promise.all(
      activities.map(async (activity) => {
        const existing = await Activity.findOne({ seedKey: activity.seedKey });
        return existing
          ? Activity.findByIdAndUpdate(existing._id, { $set: activity }, { new: true, runValidators: true })
          : Activity.create(activity);
      },
      ),
    );

    const scores = [980, 890, 870, 730];
    await Promise.all(
      users.map(async (user, index) => {
        const score = { userId: user._id, teamId: user.teamId, points: scores[index], rank: index + 1 };
        const existing = await Leaderboard.findOne({ userId: user._id });
        return existing
          ? Leaderboard.findByIdAndUpdate(existing._id, { $set: score }, { new: true, runValidators: true })
          : Leaderboard.create(score);
      },
      ),
    );

    const workouts = [
      { name: 'Couch-to-5K Starter', description: 'An approachable run-walk session for building endurance.', category: 'running', difficulty: 'beginner', duration: 30 },
      { name: 'Tempo Run', description: 'A steady effort workout to improve running pace.', category: 'running', difficulty: 'intermediate', duration: 40 },
      { name: 'Full-Body Foundations', description: 'A balanced strength session using bodyweight movements.', category: 'strength', difficulty: 'beginner', duration: 35 },
      { name: 'Power Intervals', description: 'Short cycling intervals with recovery periods.', category: 'cycling', difficulty: 'advanced', duration: 45 },
      { name: 'Restore and Reset', description: 'A gentle mobility and flexibility flow.', category: 'yoga', difficulty: 'beginner', duration: 25 },
    ];
    await Promise.all(
      workouts.map(async (workout) => {
        const existing = await Workout.findOne({ name: workout.name });
        return existing
          ? Workout.findByIdAndUpdate(existing._id, { $set: workout }, { new: true, runValidators: true })
          : Workout.create(workout);
      },
      ),
    );

    const [usersCount, teamsCount, activitiesCount, leaderboardCount, workoutsCount] =
      await Promise.all([
        User.countDocuments(),
        Team.countDocuments(),
        Activity.countDocuments(),
        Leaderboard.countDocuments(),
        Workout.countDocuments(),
      ]);
    console.log(
      `Database seeding complete: ${usersCount} users, ${teamsCount} teams, ${activitiesCount} activities, ${leaderboardCount} leaderboard entries, ${workoutsCount} workouts`,
    );
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
