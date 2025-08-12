import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

const OTP_TTL_MIN = 5; // minutes
const SALT_ROUNDS = 10;

async function sendEmail(to: string, subject: string, text: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text
  });
}

export async function sendOTP(identifier: string) {
  const code = (Math.floor(100000 + Math.random() * 900000)).toString();
  const codeHash = await bcrypt.hash(code, SALT_ROUNDS);
  const expiresAt = new Date(Date.now() + OTP_TTL_MIN * 60 * 1000);

  await prisma.oTP.deleteMany({ where: { identifier } });

  await prisma.oTP.create({
    data: { identifier, codeHash, expiresAt }
  });

  if (identifier.includes("@")) {
    await sendEmail(identifier, "Laxoria Verification Code", `Your verification code is: ${code}\nIt expires in ${OTP_TTL_MIN} minutes.`);
  } else {
    console.log(`SMS OTP for ${identifier}: ${code}  (no SMS provider configured)`);
  }
}

export async function verifyOTP(identifier: string, code: string) {
  const otp = await prisma.oTP.findFirst({ where: { identifier }, orderBy: { createdAt: "desc" } });
  if (!otp) return false;
  if (otp.expiresAt < new Date()) {
    await prisma.oTP.delete({ where: { id: otp.id } });
    return false;
  }

  const match = await bcrypt.compare(code, otp.codeHash);
  if (!match) {
    await prisma.oTP.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
    return false;
  }

  await prisma.oTP.delete({ where: { id: otp.id } });
  return true;
}
