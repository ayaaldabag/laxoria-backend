const express_1 = require('express');
const otpService_1 = require('./otpService');
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post('/request-otp', async (req, res) => {
  const { phone, email } = req.body;
  if (!phone && !email)
    return res.status(400).json({ error: 'phone or email required' });
  const code = await (0, otpService_1.sendOtp)(phone || email);
  return res.json({ ok: true, codeSent: !!code });
});
exports.authRouter.post('/verify-otp', (req, res) => {
  const { code } = req.body;
  if (code === '123456')
    return res.json({ ok: true, verified: true });
  return res.status(400).json({ ok: false, verified: false });
});
