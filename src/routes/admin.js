import { Router } from 'express';
import MonthlySummary from '../models/MonthlySummary.js';

const router = Router();

/**
 * POST /api/admin/summary
 * body: { month, counts, fileId? }
 */
router.post('/admin/summary', async (req, res, next) => {
  try {
    const { month, counts, fileId } = req.body || {};
    if (!month || !counts) return res.status(400).json({ error: 'Missing month/counts' });

    const doc = await MonthlySummary.findOneAndUpdate(
      { month },
      { $set: { counts, ...(fileId ? { fileId } : {}) } },
      { new: true, upsert: true }
    );
    res.json(doc);
  } catch (e) { next(e); }
});

/**
 * GET /api/admin/summary/:month
 */
router.get('/admin/summary/:month', async (req, res, next) => {
  try {
    const { month } = req.params;
    const doc = await MonthlySummary.findOne({ month }).lean();
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (e) { next(e); }
});

export default router;
