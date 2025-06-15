import { Request, Response, NextFunction } from 'express';
import { IAuthProvider } from '../providers/auth/IAuthProvider';

export function authenticateToken(authProvider: IAuthProvider) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({ error: 'Token not provided' });
            return;
        }

        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

        const result = authProvider.verify(token);
        if (!result) {
            res.status(403).json({ error: 'Invalid token' });
            return;
        }

        next();
    };
}