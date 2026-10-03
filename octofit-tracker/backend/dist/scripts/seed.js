"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = require("../config/database");
const activity_1 = __importDefault(require("../models/activity"));
const leaderboard_1 = __importDefault(require("../models/leaderboard"));
const team_1 = __importDefault(require("../models/team"));
const user_1 = __importDefault(require("../models/user"));
const workout_1 = __importDefault(require("../models/workout"));
function requireRecord(record, collection) {
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
        await (0, database_1.connectDatabase)();
        const teamSeed = [
            { name: 'Trail Blazers', description: 'Outdoor miles and weekend adventures', points: 0 },
            { name: 'Pulse Pioneers', description: 'Building strength one session at a time', points: 0 },
        ];
        const teams = await Promise.all(teamSeed.map(async (team) => {
            const existing = await team_1.default.findOne({ name: team.name });
            return existing
                ? team_1.default.findByIdAndUpdate(existing._id, { $set: team }, { new: true, runValidators: true })
                : team_1.default.create(team);
        }));
        const [trailBlazers, pulsePioneers] = teams.map((team) => requireRecord(team, 'team'));
        const userSeed = [
            { username: 'maya.chen', name: 'Maya Chen', email: 'maya.chen@example.com', teamId: trailBlazers._id },
            { username: 'liam.patel', name: 'Liam Patel', email: 'liam.patel@example.com', teamId: trailBlazers._id },
            { username: 'sofia.reyes', name: 'Sofia Reyes', email: 'sofia.reyes@example.com', teamId: pulsePioneers._id },
            { username: 'noah.williams', name: 'Noah Williams', email: 'noah.williams@example.com', teamId: pulsePioneers._id },
        ];
        const seededUsers = await Promise.all(userSeed.map(async (user) => {
            const existing = await user_1.default.findOne({ email: user.email });
            return existing
                ? user_1.default.findByIdAndUpdate(existing._id, { $set: user }, { new: true, runValidators: true })
                : user_1.default.create(user);
        }));
        const users = seededUsers.map((user) => requireRecord(user, 'user'));
        await Promise.all([
            team_1.default.findByIdAndUpdate(trailBlazers._id, { $set: { members: users.slice(0, 2).map((user) => user._id), points: 1870 } }),
            team_1.default.findByIdAndUpdate(pulsePioneers._id, { $set: { members: users.slice(2).map((user) => user._id), points: 1600 } }),
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
        await Promise.all(activities.map(async (activity) => {
            const existing = await activity_1.default.findOne({ seedKey: activity.seedKey });
            return existing
                ? activity_1.default.findByIdAndUpdate(existing._id, { $set: activity }, { new: true, runValidators: true })
                : activity_1.default.create(activity);
        }));
        const scores = [980, 890, 870, 730];
        await Promise.all(users.map(async (user, index) => {
            const score = { userId: user._id, teamId: user.teamId, points: scores[index], rank: index + 1 };
            const existing = await leaderboard_1.default.findOne({ userId: user._id });
            return existing
                ? leaderboard_1.default.findByIdAndUpdate(existing._id, { $set: score }, { new: true, runValidators: true })
                : leaderboard_1.default.create(score);
        }));
        const workouts = [
            { name: 'Couch-to-5K Starter', description: 'An approachable run-walk session for building endurance.', category: 'running', difficulty: 'beginner', duration: 30 },
            { name: 'Tempo Run', description: 'A steady effort workout to improve running pace.', category: 'running', difficulty: 'intermediate', duration: 40 },
            { name: 'Full-Body Foundations', description: 'A balanced strength session using bodyweight movements.', category: 'strength', difficulty: 'beginner', duration: 35 },
            { name: 'Power Intervals', description: 'Short cycling intervals with recovery periods.', category: 'cycling', difficulty: 'advanced', duration: 45 },
            { name: 'Restore and Reset', description: 'A gentle mobility and flexibility flow.', category: 'yoga', difficulty: 'beginner', duration: 25 },
        ];
        await Promise.all(workouts.map(async (workout) => {
            const existing = await workout_1.default.findOne({ name: workout.name });
            return existing
                ? workout_1.default.findByIdAndUpdate(existing._id, { $set: workout }, { new: true, runValidators: true })
                : workout_1.default.create(workout);
        }));
        const [usersCount, teamsCount, activitiesCount, leaderboardCount, workoutsCount] = await Promise.all([
            user_1.default.countDocuments(),
            team_1.default.countDocuments(),
            activity_1.default.countDocuments(),
            leaderboard_1.default.countDocuments(),
            workout_1.default.countDocuments(),
        ]);
        console.log(`Database seeding complete: ${usersCount} users, ${teamsCount} teams, ${activitiesCount} activities, ${leaderboardCount} leaderboard entries, ${workoutsCount} workouts`);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exitCode = 1;
    }
    finally {
        await mongoose_1.default.disconnect();
    }
}
seedDatabase();
