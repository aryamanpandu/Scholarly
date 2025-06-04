import express, { Request, Response } from 'express';
import mysql, {ConnectionOptions, ResultSetHeader, RowDataPacket} from 'mysql2/promise';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';
import * as session from 'express-session';
import { v4 as uuidv4 } from 'uuid';
import connectMySQL from 'express-mysql-session';


declare module 'express-session' {
    interface SessionData {
        user?: {
            id: number;
            email: string;
        };
    }
}

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

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
})); //allows cross origin requests for localhost:5173 vite react frontend

console.log("Connected to Mysql!");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session.default({
    name: 'SessionCookie',
    genid: function(req) {
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

app.get('/test', (req: Request, res: Response) => {
    console.log("Hello");
    res.status(200).send("Testing! The server is working as intended.");
}); 

//Use cookies and sessionsx
app.post('/api/signup', async (req: Request, res: Response) => {
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
        res.status(200).send({message: `Completed user sign up for ${firstName} ${lastName} with email: ${email}`});
    });
});

//loginSuccess is a boolean value that can be used to check whether the user has been logged in or not in the frontend
//TODO: use cookies and sessions 
app.post('/api/login', async (req: Request, res: Response) => {
    const {email, password} = req.body;
    
    if (!email || !password) {
        res.status(400).send({message: "All fields are required", loginSuccess: false});
        return;
    }


    const [rows] = await conn.execute<User[]>(
        `SELECT u.user_id, u.email, l.password_hash, l.failed_attempts, l.locked_until 
             FROM users u INNER JOIN logins l ON u.user_id = l.user_id WHERE u.email = ?`, [email]
    );
    //user with this email does not exist
    if (!rows.length) {
        res.status(409).send({message: `user with the email: ${email} does not yet exist.`, loginSuccess: false});
        return;
    }

    const user = rows[0];

    if (user.locked_until && user.locked_until > new Date()) {
        res.status(401).send({message: "Account is locked. Please wait for 30 minutes before trying again.", loginSuccess: false});
        return;
    }

    bcrypt.compare(password, user.password_hash, async (err, result) => {
        if (err) {
            res.status(500).send({message: "Error with checking password", loginSuccess: false});
            return;
        }

        if (result) {

            req.session.user = { //saving the session value to use it later on.
                id: user.user_id,
                email: user.email
            }

            console.log("User authenticated!");
            await conn.execute(
                `UPDATE logins
                SET failed_attempts = 0,
                locked_until = NULL
                WHERE user_id = ?`, [user.user_id]
            );

            res.status(200).send({message: `User with email: ${email} has been authorized`, loginSuccess: true});
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
            
            res.status(401).send({message: "Incorrect email or password", loginSuccess: false});
            return;
        }

    });

});

// Now I need to CRUD with Topics

// Make sure to test these APIs dude, you're only testing if they are successfull
// SO my thinking is, we setup the a value in session like email, and user id and check if they are part of the database before giving access in express, woudl that work with sessions?

// Retrieve Topics

interface Topic extends RowDataPacket{
    topicId: number,
    topicName: string,
    topicDesc: string,
    topicCreatedAt: Date
}

app.get('/api/topics', async (req: Request, res: Response) => {
    
    if (!req.session?.user || !req.session.user.email || !req.session.user.id) {
        res.status(401).send({message: "User is not authorized for this data"});
        return;
    }
    const userId = req.session.user.id;
    const email = req.session.user.email;

    // get all the topics from topics table where the user has the user_id and the email
    try {
        const [result] = await conn.execute<Topic[]>(
            `SELECT t.topic_id, t.topic_name, t.topic_desc, t.created_at
                FROM topics t INNER JOIN users u
                ON t.user_id = u.user_id
                WHERE u.user_id = ? and u.email = ?`, [userId, email]
        );

        console.log(`Topics received for user with id: ${userId} result: ${result}`);
        console.log(`JSON Res: ${JSON.stringify(result)}`);

        res.status(200).send(JSON.stringify(result));
        return;

    } catch (e) {

        console.log(e);
        return;

    }    
});

// I want to create a topic, update a topic, and delete a topic so add those apis

app.post('/api/topics', async (req: Request, res: Response) => {

    if (!req.session?.user || !req.session.user.id || !req.session.user.email) {
        res.status(401).send({ message: "User is not authorized to create new topics."});
        return;
    }

    // I am assuming that the user will send a topic with the same things as the interface
    // The user will not send createdAt cause that will just be auto generated in database.
    const { topicName, topicDesc } = req.body;

    if (!topicName || !topicDesc) {
        res.status(400).send({message: "All fields are required to create a new topic." });
        return;
    }

    try {
        //insert the topic into the topic with user_id = session.user.id
        const [result] = await conn.execute(
            `INSERT INTO topics (user_id, topic_name, topic_desc)
                VALUES (?,?,?)`, [req.session.user.id, topicName, topicDesc]
        );

        console.log(`New topic created with name ${topicName}`);
        
    res.status(200).send({ message: `Successfully created topic with name: ${topicName}` });
    return; 

    } catch (e) {

        console.log(e);
        return;

    }
});

// update an existing topic
// I dont need to change the updated_at, as that will be updated on its own
// use params for id and everything else we send through
app.put('/api/topics', async (req: Request, res: Response) => {

}); 

// What do I need to send from topics table?
// topic_id so that we can access the decks related to that topic
// topic_name, topic_desc, created_at 