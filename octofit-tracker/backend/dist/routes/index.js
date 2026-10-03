"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const activity_1 = __importDefault(require("../models/activity"));
const leaderboard_1 = __importDefault(require("../models/leaderboard"));
const team_1 = __importDefault(require("../models/team"));
const user_1 = __importDefault(require("../models/user"));
const workout_1 = __importDefault(require("../models/workout"));
const resourceRouter_1 = __importDefault(require("./resourceRouter"));
const router = (0, express_1.Router)();
router.use('/users/', (0, resourceRouter_1.default)(user_1.default));
router.use('/teams/', (0, resourceRouter_1.default)(team_1.default));
router.use('/activities/', (0, resourceRouter_1.default)(activity_1.default));
router.use('/leaderboard/', (0, resourceRouter_1.default)(leaderboard_1.default, { points: -1 }));
router.use('/workouts/', (0, resourceRouter_1.default)(workout_1.default));
exports.default = router;
