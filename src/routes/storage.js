import { Router } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { getS3 } from '../utils/r2.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const BUCKET = process.env.R2_BUCKET;

router.post('/storage/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Missing file' });
    const key = uuidv4();
    const s3 = getS3();

    await s3.putObject({
      Bucket: BUCKET,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'private'
    }).promise();

    res.json({ fileId: key });
  } catch (e) { next(e); }
});

router.delete('/storage/:fileId', async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const s3 = getS3();
    await s3.deleteObject({ Bucket: BUCKET, Key: fileId }).promise();
    res.json({ ok: true });
  } catch (e) { next(e); }
});

router.get('/storage/:fileId/download', async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const s3 = getS3();
    const url = s3.getSignedUrl('getObject', {
      Bucket: BUCKET,
      Key: fileId,
      Expires: 60 // seconds
    });
    res.json({ url });
  } catch (e) { next(e); }
});

router.get('/storage/:fileId/view', async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const s3 = getS3();
    const url = s3.getSignedUrl('getObject', {
      Bucket: BUCKET,
      Key: fileId,
      Expires: 60
    });
    res.json({ url });
  } catch (e) { next(e); }
});

export default router;
