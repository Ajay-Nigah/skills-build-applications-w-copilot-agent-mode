"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = require("./config/database");
const activity_1 = __importDefault(require("./models/activity"));
const leaderboard_1 = __importDefault(require("./models/leaderboard"));
const team_1 = __importDefault(require("./models/team"));
const user_1 = __importDefault(require("./models/user"));
const workout_1 = __importDefault(require("./models/workout"));
const resourceRouter_1 = __importDefault(require("./routes/resourceRouter"));
const app = (0, express_1.default)();
const port = 8000;
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
app.use(express_1.default.json());
app.use('/api/users/', (0, resourceRouter_1.default)(user_1.default));
app.use('/api/teams/', (0, resourceRouter_1.default)(team_1.default));
app.use('/api/activities/', (0, resourceRouter_1.default)(activity_1.default));
app.use('/api/leaderboard/', (0, resourceRouter_1.default)(leaderboard_1.default, { points: -1 }));
app.use('/api/workouts/', (0, resourceRouter_1.default)(workout_1.default));
app.get('/', (_request, response) => {
    response.json({
        service: 'OctoFit Tracker API',
        status: 'ok',
        health: `${baseUrl}/api/health`,
        resources: [
            `${baseUrl}/api/users/`,
            `${baseUrl}/api/teams/`,
            `${baseUrl}/api/activities/`,
            `${baseUrl}/api/leaderboard/`,
            `${baseUrl}/api/workouts/`,
        ],
    });
});
app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok', service: 'octofit-tracker-api', baseUrl });
});
const errorHandler = (error, _request, response, _next) => {
    if (error instanceof mongoose_1.default.Error.ValidationError || error instanceof mongoose_1.default.Error.CastError) {
        response.status(400).json({ error: error.message });
        return;
    }
    if (typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 11000) {
        response.status(409).json({ error: 'A record with those unique fields already exists' });
        return;
    }
    console.error('Unhandled API error:', error);
    response.status(500).json({ error: 'Internal server error' });
};
app.use(errorHandler);
async function startServer() {
    await (0, database_1.connectDatabase)();
    app.listen(port, '0.0.0.0', () => {
        console.log(`OctoFit API listening at ${baseUrl}`);
    });
}
startServer().catch((error) => {
    console.error('Failed to start OctoFit API:', error);
    process.exitCode = 1;
});
