import { Router } from 'express';
import Attendance from '../models/Attendance.js';

const router = Router();

function toVNDateString(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * POST /api/attendance/checkin
 * body: { userId, username }
 */
router.post('/attendance/checkin', async (req, res, next) => {
  try {
    const { userId, username } = req.body || {};
    if (!userId || !username) return res.status(400).json({ error: 'Missing userId/username' });

    const now = new Date();
    const vnDate = toVNDateString(now);

    // Optional: chặn ngoài khung giờ 06:00–08:30 theo giờ server
    const start = new Date(now); start.setHours(6, 0, 0, 0);
    const end = new Date(now); end.setHours(8, 30, 0, 0);
    if (now < start || now > end) {
      return res.status(400).json({ error: 'Ngoài khung giờ điểm danh (06:00–08:30)' });
    }

    const record = await Attendance.create({
      userId, username, type: 'checkin', time: now, vnDate
    });

    res.json({ ok: true, record });
  } catch (e) { next(e); }
});

/**
 * GET /api/attendance/history/:userId?days=7
 */
router.get('/attendance/history/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const days = Number(req.query.days || 7);
    const from = new Date(); from.setDate(from.getDate() - (days - 1));
    const fromStr = toVNDateString(from);

    const list = await Attendance.find({
      userId,
      vnDate: { $gte: fromStr }
    }).sort({ time: -1 }).lean();

    res.json(list);
  } catch (e) { next(e); }
});

export default router;
