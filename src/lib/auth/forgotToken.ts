import prisma from '../prisma';

import crypto from 'crypto';
import { Resend } from 'resend';

import { EmailTemplate } from '@/components/email/EmailTemplate';

export function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function addPasswordToken(tokenHash: string, userId: string) {
  // delete any existing tokens for this user
  await prisma.passwordResetToken.deleteMany({
    where: { userId }
  });

  await prisma.passwordResetToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 mins
    },
    select: { id: true }
  });
}

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(email: string, token: string) {
  await resend.emails.send({
    from: `KTP Hub <${process.env.EMAIL}>`,
    to: email,
    subject: 'Password Reset Link',
    react: EmailTemplate({ token })
  });
}

export async function findToken(tokenHash: string) {
  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      expiresAt: { gt: new Date() }
    },
    select: { userId: true }
  });

  return resetToken;
}

export async function deleteToken(tokenHash: string) {
  await prisma.passwordResetToken.deleteMany({
    where: { tokenHash }
  });
}

export async function updatePassword(
  userId: string, hashedPassword: string, salt: string
) {
  await prisma.session.deleteMany({
    where: { userId }
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      hashedPassword,
      salt
    }
  })
}
