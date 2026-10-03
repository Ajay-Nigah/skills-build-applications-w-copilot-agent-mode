"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createResourceRouter;
const express_1 = require("express");
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function hasSafeUpdateKeys(value) {
    return Object.keys(value).every((key) => key !== '_id' && key !== '__v' && !key.startsWith('$') && !key.includes('.'));
}
function createResourceRouter(model, sort = {}) {
    const router = (0, express_1.Router)();
    router.get('/', async (_request, response, next) => {
        try {
            response.json(await model.find().sort(sort).lean().exec());
        }
        catch (error) {
            next(error);
        }
    });
    router.post('/', async (request, response, next) => {
        if (!isRecord(request.body)) {
            response.status(400).json({ error: 'Request body must be a JSON object' });
            return;
        }
        try {
            response.status(201).json(await model.create(request.body));
        }
        catch (error) {
            next(error);
        }
    });
    router.get('/:id', async (request, response, next) => {
        try {
            const record = await model.findById(request.params.id).lean().exec();
            if (!record) {
                response.status(404).json({ error: 'Record not found' });
                return;
            }
            response.json(record);
        }
        catch (error) {
            next(error);
        }
    });
    router.patch('/:id', async (request, response, next) => {
        if (!isRecord(request.body) || !hasSafeUpdateKeys(request.body)) {
            response.status(400).json({ error: 'Request body must contain valid fields to update' });
            return;
        }
        try {
            const record = await model
                .findByIdAndUpdate(request.params.id, { $set: request.body }, { new: true, runValidators: true })
                .lean()
                .exec();
            if (!record) {
                response.status(404).json({ error: 'Record not found' });
                return;
            }
            response.json(record);
        }
        catch (error) {
            next(error);
        }
    });
    router.delete('/:id', async (request, response, next) => {
        try {
            const record = await model.findByIdAndDelete(request.params.id).exec();
            if (!record) {
                response.status(404).json({ error: 'Record not found' });
                return;
            }
            response.sendStatus(204);
        }
        catch (error) {
            next(error);
        }
    });
    return router;
}
