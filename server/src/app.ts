import express, { Request, Response } from 'express';
import mysql, {ConnectionOptions, ResultSetHeader, RowDataPacket} from 'mysql2/promise';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';
import * as session from 'express-session';
import { v4 as uuidv4 } from 'uuid';
import connectMySQL from 'express-mysql-session';

dotenv.config();
const app = express();
const port = 3000;

const MySQLStore = connectMySQL(session);

const access: ConnectionOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD || '',
    port: Number(process.env.DB_PORT)
}

const sessionStore = new MySQLStore(access);
const conn = await mysql.createConnection(access);


console.log("Connected to Mysql!");
app.use(session.default({
    name: 'SessionCookie',
    genid: function(req) {
        console.log('session id created');
        return uuidv4();
    },
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    store: sessionStore,
    cookie: {
        secure: false,
        maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days expiry
    }
    //Set secure to true if you want it in production for https access only
}));
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

//1. Check if there is a user already with the same email
//2. If there is not, check if confirmPassword and passwords match
//3. If they do, create a hash probably using bcrypt
//4. Then add the important password details to login,
app.post('/signup', async (req: Request, res: Response) => {
    const {firstName, lastName, email, password, confirmPassword} = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        res.status(400).send("All fields are required");
    }

    const [rows] = await conn.execute<User[]>('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length > 0) { //there is already a user with this email
        res.status(409).send({message: "User already exists"});
        return;
    }

    if (password !== confirmPassword) {
        res.status(409).send({message: "The passwords do not match"});
        return;
    }

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
            res.status(500).send({message: "The server is having issues creating your account."});
            return;
        }

        console.log(`Password hashed: ${hash}`);

        //Now store the hashed password into the database tables.
        const [userRes] = await conn.execute<ResultSetHeader>(
            `INSERT INTO users (email, first_name, last_name)
                VALUES (?, ?, ?)`, [email, firstName, lastName]
        );

        console.log(userRes);
        const userId = userRes.insertId;

        const [loginRes] = await conn.execute<ResultSetHeader>(
            `INSERT INTO logins (user_id, password_hash)
                VALUES (?, ?)`, [userId, hash]
        );

        console.log("Completed Sign Up");
        console.log(loginRes);
    });

});

//Login now
//First I would check if a user with that email even exists
//Next, I would get password_hash, failed_attempts, locked_until
// from logins where user_id is the same in users, logins and email is the provided email
//Next, I would need to check the password with its hash
app.post('/login', async (req: Request, res: Response) => {
    const {email, password} = req.body;
    
    if (!email || !password) {
        res.status(400).send("All fields are required");
    }


    const [rows] = await conn.execute<User[]>(
        `SELECT l.password_hash, l.failed_attempts, l.locked_until 
             FROM u.users INNER JOIN l.logins ON u.user_id = l.user_id WHERE u.email = ?`, [email]
    );
    //user with this email does not exist
    if (!rows.length) {
        res.status(409).send({message: `user with the email: ${email} does not yet exist.`});
    }

    const user = rows[0];
    
    // First you would check if the account is locked until a certain time. 
    // If it is, then you would not allow login.
    // If is not, then you would check
    

});