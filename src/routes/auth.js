import { Router } from 'express';
import axios from 'axios';

const router = Router();

/**
 * POST /api/login
 * body: { email, password }
 * return: { userId, email, name, accessToken }
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Missing email/password' });

    const tokenRes = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      grant_type: 'password',
      username: email,
      password,
      audience: process.env.AUTH0_AUDIENCE,
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      scope: 'openid profile email'
    }, { headers: { 'Content-Type': 'application/json' } });

    const accessToken = tokenRes.data.access_token;

    const userinfo = await axios.get(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const user = userinfo.data; // { sub, email, name, picture, ... }
    return res.json({
      userId: user.sub,
      email: user.email,
      name: user.name,
      accessToken
    });
  } catch (err) {
    const msg = err.response?.data || err.message;
    err.status = err.response?.status || 500;
    err.message = typeof msg === 'string' ? msg : JSON.stringify(msg);
    next(err);
  }
});

export default router;
