const fs = require('fs');
const path = require('path');
const { DB } = require('../database/db');
const { createError } = require('../middleware/errorHandler');

async function getAll(req, res, next) {
  try {
    const { search = '', page = 1, limit = 20 } = req.query;
    const result = DB.getAll({ search, page, limit });
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const row = DB.getById(req.params.id);
    if (!row) throw createError('Recording not found', 404);
    res.json({ success: true, data: row });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    if (!req.file) throw createError('Audio file is required', 400);
    const { title, clientName, notes = '' } = req.body;
    if (!title?.trim()) throw createError('Title is required', 400);
    if (!clientName?.trim()) throw createError('Client name is required', 400);

    const created = DB.create({
      title: title.trim(),
      clientName: clientName.trim(),
      notes: notes.trim(),
      fileName: req.file.originalname,
      filePath: req.file.path, // Cloudinary URL
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const row = DB.delete(req.params.id);
    if (!row) throw createError('Recording not found', 404);

    // const filePath = path.join(__dirname, '..', 'uploads', row.filePath);
    // fs.unlink(filePath, (err) => {
    //   if (err && err.code !== 'ENOENT') console.error('[WARN] Could not delete file:', err.message);
    // });

    res.json({ success: true, message: 'Recording deleted successfully' });
  } catch (err) { next(err); }
}

async function stream(req, res, next) {
  try {
    const row = DB.getById(req.params.id);
    if (!row) throw createError('Recording not found', 404);

    const filePath = path.join(__dirname, '..', 'uploads', row.filePath);
    if (!fs.existsSync(filePath)) throw createError('Audio file not found on server', 404);

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': row.mimeType || 'audio/mpeg',
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': row.mimeType || 'audio/mpeg',
        'Accept-Ranges': 'bytes',
      });
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) { next(err); }
}

module.exports = { getAll, getById, create, remove, stream };