import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from 'models/User';
import { Request, Response } from 'express';

export const registerUser = async (req: Request<{}, {}, RegisterUserRequestBody>, res: Response) => {
	try {
		const { firstName, lastName, email, password, picturePath, friends, location, occupation } = req.body;

		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(password, salt);

		const newUser = new User({
			firstName,
			lastName,
			email,
			password: passwordHash,
			picturePath,
			friends,
			location,
			occupation
		});

		const savedUser = await newUser.save();
		res.status(201).json(savedUser);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ error: error.message });
		} else {
			res.status(500).json({ error: 'An unknown error occurred' });
		}
	}
};

export const loginUser = async (req: Request<{}, {}, LoginUserRequestBody>, res: Response) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			res.status(400).json({ message: 'User does not exist.' });
			return;
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			res.status(400).json({ message: 'Invalid credentials.' });
			return;
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET ?? '');
		const { password: _, ...userWithoutPassword } = user.toObject();
		res.status(200).json({ token, user: userWithoutPassword });
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ error: error.message });
		} else {
			res.status(500).json({ error: 'An unknown error occurred' });
		}
	}
};
