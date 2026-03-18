import { Role } from '@prisma/client';
import { AppError } from '../middlewares/error.middleware';
import * as userRepo from '../repositories/user.repository';
import * as pointRepo from '../repositories/point.repository';
import * as voucherRepo from '../repositories/voucher.repository';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { signToken } from '../utils/jwt';
import { generateReferralCode, generateVoucherCode } from '../utils/generators';

const REFERRAL_POINTS = 10000;
const REFERRAL_COUPON_PERCENT = 10;
const THREE_MONTHS_MS = 3 * 30 * 24 * 60 * 60 * 1000;

export const register = async (data: {
  name: string;
  email: string;
  password: string;
  role: Role;
  referralCode?: string;
}) => {
  // Check email uniqueness
  const existing = await userRepo.findUserByEmail(data.email);
  if (existing) throw new AppError('Email sudah terdaftar', 409);

  const hashedPw = await hashPassword(data.password);
  const myReferralCode = generateReferralCode();
  const expiresAt = new Date(Date.now() + THREE_MONTHS_MS);

  // Validate referral code
  let referralOwner = null;
  if (data.referralCode) {
    referralOwner = await userRepo.findUserByReferralCode(data.referralCode);
    if (!referralOwner) throw new AppError('Kode referral tidak valid', 400);
  }

  // Create new user
  const user = await userRepo.createUser({
    name: data.name,
    email: data.email,
    password: hashedPw,
    role: data.role,
    referralCode: myReferralCode,
    referredBy: data.referralCode,
  });

  let coupon = null;

  // Reward referral owner with 10,000 points
  if (referralOwner) {
    await pointRepo.createPoint({
      userId: referralOwner.id,
      points: REFERRAL_POINTS,
      source: `REFERRAL dari ${user.email}`,
      expiresAt,
    });

    // Give referral discount voucher to new user (10% off, valid 3 months)
    const couponCode = generateVoucherCode('REF');
    coupon = await voucherRepo.createVoucher({
      eventId: 1, // General voucher — will be usable on any event
      code: couponCode,
      discountPercent: REFERRAL_COUPON_PERCENT,
      maxUsage: 1,
      expiresAt,
    });
    await voucherRepo.createUserVoucher(user.id, coupon.id);
  }

  const token = signToken({ userId: user.id, email: user.email, role: user.role });
  return { user: { ...user, password: undefined }, token, coupon };
};

export const login = async (email: string, password: string) => {
  const user = await userRepo.findUserByEmail(email);
  if (!user) throw new AppError('Email atau password salah', 401);

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new AppError('Email atau password salah', 401);

  const token = signToken({ userId: user.id, email: user.email, role: user.role });
  const { password: _, ...safeUser } = user;
  return { user: safeUser, token };
};

export const getMe = async (userId: number) => {
  const user = await userRepo.findUserById(userId);
  if (!user) throw new AppError('Pengguna tidak ditemukan', 404);
  return user;
};
