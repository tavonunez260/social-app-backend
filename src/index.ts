import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import multer from 'multer';
/* CONTROLLERS */
import { registerUser } from 'controllers';
import { verifyToken } from 'middleware';
/* ROUTES */


/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE */
const storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, 'public/assets');
	},
	filename(req, file, callback) {
		callback(null, file.originalname);
	}
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post('auth/register', upload.single('picture'), verifyToken, registerUser);
/* ROUTES */

/* MONGOOSE SETUP */
const PORT = process.env.PORT ?? 6001;
mongoose
	.connect(process.env.MONGO_URL ?? '')
	.then(() => {
		app.listen(PORT, () => console.log(`Server port: ${PORT}`));
	})
	.catch(error => console.log(`${error}: did not connect`));
