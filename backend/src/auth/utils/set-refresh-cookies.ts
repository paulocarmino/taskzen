import { Response } from 'express';
import { parseDuration } from './parse-duration';

export function setRefreshTokenCookie(res: Response, token: string) {
  const isProd = process.env.NODE_ENV === 'production';
  const maxAge = parseDuration(process.env.REFRESH_TOKEN_EXPIRES_IN || '7d');

  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/auth/token/refresh',
    maxAge,
  });
}
