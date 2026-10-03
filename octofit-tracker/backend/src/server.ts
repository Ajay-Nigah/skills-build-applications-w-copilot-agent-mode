import express, { type ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { connectDatabase } from './config/database';
import Activity from './models/activity';
import Leaderboard from './models/leaderboard';
import Team from './models/team';
import User from './models/user';
import Workout from './models/workout';
import createResourceRouter from './routes/resourceRouter';

const app = express();
const port = 8000;
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());
app.use('/api/users/', createResourceRouter(User));
app.use('/api/teams/', createResourceRouter(Team));
app.use('/api/activities/', createResourceRouter(Activity));
app.use('/api/leaderboard/', createResourceRouter(Leaderboard, { points: -1 }));
app.use('/api/workouts/', createResourceRouter(Workout));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'octofit-tracker-api', baseUrl });
});

const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    response.status(400).json({ error: error.message });
    return;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 11000
  ) {
    response.status(409).json({ error: 'A record with those unique fields already exists' });
    return;
  }

  console.error('Unhandled API error:', error);
  response.status(500).json({ error: 'Internal server error' });
};

app.use(errorHandler);

async function startServer() {
  await connectDatabase();
  app.listen(port, '0.0.0.0', () => {
    console.log(`OctoFit API listening at ${baseUrl}`);
  });
}

startServer().catch((error: unknown) => {
  console.error('Failed to start OctoFit API:', error);
  process.exitCode = 1;
});
