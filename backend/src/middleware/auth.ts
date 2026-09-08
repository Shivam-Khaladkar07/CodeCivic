import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/types.js';
import { db } from '../database/db.js';

export interface AuthRequest extends Request {
  user?: User;
}

const JWT_SECRET = process.env.JWT_SECRET || 'jsix_super_secret_jwt_token_key_2026_sih';

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: UserRole };
    const user = db.findOne('users', (u) => u.id === decoded.id);
    if (!user) {
      return res.status(403).json({ error: 'Invalid user or session expired' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token invalid or expired' });
  }
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (req.user.role === 'admin' || allowedRoles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({
      error: `Permission denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`,
    });
  };
}
