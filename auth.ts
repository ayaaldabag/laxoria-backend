import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { sendOTP, verifyOTP } from "../services/otpService";

const prisma = new PrismaClient();
const router = Router();

const MAX_USERS = parseInt(process.env.MAX_USERS || "10", 10);

router.post("/request-otp", async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) return res.status(400).json({ error: req.t("identifier_required") });

    await sendOTP(identifier);
    return res.json({ ok: true, message: req.t("otp_sent") });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: req.t("server_error") });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { identifier, code } = req.body;
    if (!identifier || !code) return res.status(400).json({ error: req.t("identifier_code_required") });

    const ok = await verifyOTP(identifier, code);
    if (!ok) return res.status(400).json({ error: req.t("invalid_or_expired_code") });

    const totalUsers = await prisma.user.count();
    if (totalUsers >= MAX_USERS) {
      return res.status(403).json({ error: "user_limit_reached", message: req.t("user_limit_message", { max: MAX_USERS }) });
    }

    const isEmail = identifier.includes("@");
    const where = isEmail ? { email: identifier } : { phone: identifier };
    let user = await prisma.user.findUnique({ where });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: isEmail ? identifier : null,
          phone: isEmail ? null : identifier,
          verified: true
        }
      });
    } else {
      user = await prisma.user.update({
        where,
        data: { verified: true }
      });
    }

    return res.json({ ok: true, user: { id: user.id, email: user.email, phone: user.phone } });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: req.t("server_error") });
  }
});

export default router;
