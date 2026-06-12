const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const DB_PATH = path.join(__dirname, 'recordings.json');
const adapter = new FileSync(DB_PATH);
const db = low(adapter);

// Set defaults
db.defaults({ recordings: [], _seq: 0 }).write();

function getNextId() {
  const next = db.get('_seq').value() + 1;
  db.set('_seq', next).write();
  return next;
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function rowToDto(row) {
  return { ...row, fileSizeFormatted: formatBytes(row.fileSize) };
}

const DB = {
  getAll({ search = '', page = 1, limit = 20 } = {}) {
    let rows = db.get('recordings').value();
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        r => r.title.toLowerCase().includes(q) || r.clientName.toLowerCase().includes(q)
      );
    }
    // Sort by newest first
    rows = [...rows].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const total = rows.length;
    const offset = (Math.max(1, parseInt(page)) - 1) * Math.min(100, parseInt(limit));
    const take = Math.min(100, parseInt(limit));
    return {
      data: rows.slice(offset, offset + take).map(rowToDto),
      pagination: { total, page: parseInt(page), limit: take, totalPages: Math.ceil(total / take) }
    };
  },

  getById(id) {
    const row = db.get('recordings').find({ id: parseInt(id) }).value();
    return row ? rowToDto(row) : null;
  },

  create({ title, clientName, notes, fileName, filePath, fileSize, mimeType }) {
    const id = getNextId();
    const now = new Date().toISOString();
    const record = { id, title, clientName, notes: notes || '', fileName, filePath, fileSize, mimeType, createdAt: now, updatedAt: now };
    db.get('recordings').push(record).write();
    return rowToDto(record);
  },

  delete(id) {
    const row = db.get('recordings').find({ id: parseInt(id) }).value();
    if (!row) return null;
    db.get('recordings').remove({ id: parseInt(id) }).write();
    return row;
  }
};

module.exports = { DB };