import express, { Request, Response } from 'express';
import mysql, {ConnectionOptions, RowDataPacket} from 'mysql2/promise';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const port = 3000;

const access: ConnectionOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD || '',
    port: Number(process.env.DB_PORT)
}

const conn = await mysql.createConnection(access);


console.log("Connected to Mysql!");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors()); //allows cross origin requests for all ip addresses.

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, typescript express!');
});

app.listen(port, () => {
    console.log(`server running at localhost:${port}`);
});




interface User extends RowDataPacket {
    user_id: number,
    email: string,
    first_name: string,
    last_name: string,
    created_at: Date,
    updated_at: Date
}

//Check if there is a user already with the same email
app.post('/signup', async (req: Request, res: Response) => {
    const {firstName, lastName, email, password, confirmPassword} = req.body;
    const [rows] = await conn.execute<User[]>('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
        res.status(409).send({message: "User already exists"});
        return;
    }
    
});
 