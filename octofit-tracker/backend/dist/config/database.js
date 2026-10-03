"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionString = void 0;
exports.connectDatabase = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
exports.connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const db = mongoose_1.default.connection;
async function connectDatabase() {
    await mongoose_1.default.connect(exports.connectionString);
    console.log('Connected to octofit_db');
}
db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});
exports.default = db;
