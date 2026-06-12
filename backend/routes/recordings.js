const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const ctrl = require('../controllers/recordingsController');

// GET /api/recordings          — list all (with optional ?search= and pagination)
router.get('/', ctrl.getAll);

// GET /api/recordings/:id      — single recording metadata
router.get('/:id', ctrl.getById);

// GET /api/recordings/:id/stream — audio file stream (Range-request aware)
router.get('/:id/stream', ctrl.stream);

// POST /api/recordings         — upload new recording
router.post('/', upload.single('audio'), ctrl.create);

// DELETE /api/recordings/:id   — remove recording + file
router.delete('/:id', ctrl.remove);

module.exports = router;