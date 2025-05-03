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
app.use(express.urlencoded({ extended: true }));
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

//Use cookies and sessionsx
app.post('/signup', async (req: Request, res: Response) => {
    const {firstName, lastName, email, password, confirmPassword} = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        res.status(400).send("All fields are required");
        return;
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
        res.status(200).send({message: `Completed user sign up for ${firstName} ${lastName} with email: ${email}`});
    });

});

//TODO: use cookies and sessions 
app.post('/login', async (req: Request, res: Response) => {
    const {email, password} = req.body;
    
    if (!email || !password) {
        res.status(400).send("All fields are required");
        return;
    }


    const [rows] = await conn.execute<User[]>(
        `SELECT u.user_id, l.password_hash, l.failed_attempts, l.locked_until 
             FROM users u INNER JOIN logins l ON u.user_id = l.user_id WHERE u.email = ?`, [email]
    );
    //user with this email does not exist
    if (!rows.length) {
        res.status(409).send({message: `user with the email: ${email} does not yet exist.`});
        return;
    }

    const user = rows[0];

    if (user.locked_until && user.locked_until > new Date()) {
        res.status(401).send("Account is locked. Please wait for 30 minutes before trying again.");
        return;
    }

    bcrypt.compare(password, user.password_hash, async (err, result) => {
        if (err) {
            res.status(500).send("Error with checking password");
            return;
        }

        if (result) {
            console.log("User authenticated!");
            await conn.execute(
                `UPDATE logins
                SET failed_attempts = 0,
                locked_until = NULL
                WHERE user_id = ?`, [user.user_id]
            );
            res.status(200).send({message: `User with email: ${email} has been authorized`});
            return;
        } else {
            console.log("User not allowed!");

            if (user.failed_attempts + 1 >= 5) {
                const lockUntil = new Date(Date.now() + 30 * 60 * 1000); //30 minutes in ms
                await conn.execute(
                    `UPDATE logins
                    SET failed_attempts = failed_attempts + 1,
                    locked_until = ? WHERE user_id = ?`, [lockUntil, user.user_id]
                );

            } else {
                await conn.execute(
                    `UPDATE logins 
                    SET failed_attempts = failed_attempts + 1 
                    WHERE user_id = ?`, [user.user_id]
                );
            }
            
            res.status(401).send("Incorrect email or password");
            return;
        }

    });

});