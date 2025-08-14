import { Router } from 'express';
import { sendOtp } from './otpService';

export const authRouter = Router();

authRouter.post('/request-otp', async (req, res) => {
  const { phone, email } = req.body;
  if (!phone && !email) return res.status(400).json({ error: 'phone or email required' });
  // This is a stub: sendOtp would call real service
  const code = await sendOtp(phone || email);
  return res.json({ ok: true, codeSent: !!code });
});

authRouter.post('/verify-otp', (req, res) => {
  const { code } = req.body;
  // stub verification
  if (code === '123456') return res.json({ ok: true, verified: true });
  return res.status(400).json({ ok: false, verified: false });
});
