import { Request, Response, NextFunction } from 'express';
import { JWTProvider } from '../providers/JWTProvider';

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization;

    if (!token) {
        res.status(401).json({ error: 'Token not provided' });
        return;
    }

    try {
        const jwt = new JWTProvider();
        jwt.verify(token);
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
        return;
    }

}