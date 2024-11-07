import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		let token = req.header('Authorization');

		if (!token) {
			res.status(403).send('Access denied');
			return;
		}

		if (token.startsWith('Bearer ')) {
			token = token.slice(7, token.length).trimStart();
		}

		(req as any).user = jwt.verify(token, process.env.TOKEN_SECRET ?? '');

		next();
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ error: error.message });
		} else {
			res.status(500).json({ error: 'An unknown error occurred' });
		}
	}
};
