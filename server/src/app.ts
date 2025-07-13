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

interface UserRow extends RowDataPacket {
    user_id: number,
    email: string,
    first_name: string,
    last_name: string,
    created_at: Date,
    updated_at: Date,
    password_hash: string,
    failed_attempts: number,
    locked_until: Date | null
}



interface User {
    userId: number,
    email: string,
    firstName: string,
    lastName: string,
    createdAt: Date,
    updatedAt: Date,
    passwordHash: string,
    failedAttempts: number,
    lockedUntil: Date | null
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

    const [rows] = await conn.execute<UserRow[]>('SELECT * FROM users WHERE email = ?', [email]);

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


    const [rawRows] = await conn.execute<UserRow[]>(
        `SELECT u.user_id, u.email, l.password_hash, l.failed_attempts, l.locked_until 
             FROM users u INNER JOIN logins l ON u.user_id = l.user_id WHERE u.email = ?`, [email]
    );

    const rows: User[] = rawRows.map(row => ({
        userId: row.user_id,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        passwordHash: row.password_hash,
        failedAttempts: row.failed_attempts,
        lockedUntil: row.locked_until
    }));

    console.log(rows);
    //user with this email does not exist
    if (!rows.length) {
        res.status(409).send({message: `user with the email: ${email} does not yet exist.`, loginSuccess: false});
        return;
    }

    const user = rows[0];

    if (user.lockedUntil && user.lockedUntil > new Date()) {
        res.status(401).send({message: "Account is locked. Please wait for 30 minutes before trying again.", loginSuccess: false});
        return;
    }

    bcrypt.compare(password, user.passwordHash, async (err, result) => {
        if (err) {
            res.status(500).send({message: "Error with checking password", loginSuccess: false});
            return;
        }

        if (result) {

            req.session.user = { //saving the session value to use it later on.
                id: user.userId,
                email: user.email
            }

            console.log("User authenticated!");
            await conn.execute(
                `UPDATE logins
                SET failed_attempts = 0,
                locked_until = NULL
                WHERE user_id = ?`, [user.userId]
            );

            res.status(200).send({message: `User with email: ${email} has been authorized`, loginSuccess: true});
            return;

        } else {
            console.log("User not allowed!");

            if (user.failedAttempts + 1 >= 5) {
                const lockUntil = new Date(Date.now() + 30 * 60 * 1000); //30 minutes in ms
                await conn.execute(
                    `UPDATE logins
                    SET failed_attempts = failed_attempts + 1,
                    locked_until = ? WHERE user_id = ?`, [lockUntil, user.userId]
                );

            } else {
                await conn.execute(
                    `UPDATE logins 
                    SET failed_attempts = failed_attempts + 1 
                    WHERE user_id = ?`, [user.userId]
                );
            }
            
            res.status(401).send({message: "Incorrect email or password", loginSuccess: false});
            return;
        }

    });

});

app.post('/api/logout', async (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(`Logout Error for user: ${req.session.user?.email}; message: ${err}`);
            res.status(500).send({message: `Error logging out`});
            return;
        } else {
            res.status(200).send({message:'Successfully logged out'});
            return;
        }
    });
});

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

        console.log(`Topics received for user with id: ${userId}`);

        res.status(200).send(JSON.stringify(result));
        return;

    } catch (e) {

        console.log(e);
        res.status(500).send({ message: 'Internal server error. Please try later.'});
        return;

    }    
});

// I want to create a topic, update a topic, and delete a topic so add those apis

app.post('/api/topics', async (req: Request, res: Response) => {

    if (!req.session?.user || !req.session.user.id || !req.session.user.email) {
        res.status(401).send({ message: "User is not authorized to create new topics."});
        return;
    }

    const { topicName, topicDesc } = req.body;

    if (!topicName) {
        res.status(400).send({message: "A topic name is required to create a new topic." });
        return;
    }

    try {
        //insert the topic into the topic with user_id = session.user.id
        await conn.execute(
            `INSERT INTO topics (user_id, topic_name, topic_desc)
                VALUES (?,?,?)`, [req.session.user.id, topicName, topicDesc]
        );

        console.log(`New topic created with name ${topicName}`);
        
        res.status(200).send({ message: `Successfully created topic with name: ${topicName}` });
        return; 

    } catch (e) {

        console.log(e);
        res.status(500).send({ message: 'Internal server error. Please try later.'});
        return;

    }
});


app.put('/api/topics/:topicId', async (req: Request, res: Response) => {

    if (!req.session?.user || !req.session.user.id || !req.session.user.email) {
        res.status(401).send({ message: "User is not authorized to update topics."});
        return;
    }

    const { topicName, topicDesc } = req.body;
    const topicId = req.params.topicId;

    if (!topicName || !topicDesc || !topicId) {
        res.status(400).send({message: "Invalid Request." });
        return;
    }

    try {
        await conn.execute(
            `UPDATE topics 
                SET topic_name = ?, topic_desc = ?
                WHERE user_id = ? AND topic_id = ?`, [topicName, topicDesc, req.session.user.id, topicId]
        );
        
        res.status(200).send({ message: `Successfully updated topic with topic id: ${topicId}`});
    } catch (e) {

        console.log(e);
        res.status(500).send({ message: 'Internal server error. Please try later.'});
        return;

    }
}); 


app.delete('/api/topics/:topicId/:topicName', async (req: Request, res: Response) => {

    if (!req.session?.user || !req.session.user.id || !req.session.user.email) {
        res.status(401).send({ message: "User is not authorized to delete topics."});
        return;
    }

    const topicId = req.params.topicId;
    const topicName = req.params.topicName;

    if (!topicId) {
        res.status(400).send({message: "Invalid Request." });
        return;
    }

    await conn.beginTransaction();
    try {
       
        const [decksRes] = await conn.execute(
            `SELECT deck_id FROM decks WHERE topic_id = ?`, [topicId]
        );

        //Getting an array of deck IDs
        const deckIds = (decksRes as { deck_id : number }[]).map(r => r.deck_id);
        
        for (const id of deckIds) {

            await deleteFlashcardsForDeck(id.toString());
    
        }
        
        const [deckDelRes] = await conn.execute(
            `DELETE d
            FROM decks d
            JOIN (
                SELECT deck_id FROM decks WHERE topic_id = ?
            ) t
            ON d.deck_id = t.deck_id 
            WHERE d.topic_id = ?`, [topicId, topicId]
        );

        const numAffectedDecks = (deckDelRes as ResultSetHeader).affectedRows;
        console.log(`${numAffectedDecks} decks affected`);
         
        await conn.execute(
            `DELETE FROM topics WHERE user_id = ? AND topic_id = ?`, [req.session.user.id,topicId]
        );

        console.log(`Topic with ID: ${topicId} Deleted successfully`);

        res.status(200).send({ message: `Successfully deleted topic: ${topicName}` });
        return;

        } catch (e) {
            await conn.rollback();
            console.log(`Transaction failed: ${e}`);
        } 
});

interface Deck extends RowDataPacket {
    deckId: number,
    deckName: string,
    deckDesc: string,
    deckCreatedAt: Date
}

//Get all the Decks from a topic
app.get('/api/decks/:topicId', async (req: Request, res: Response) => {
    
    if(!req.session.user || !req.session.user.id || !req.session.user.email) {
        res.status(401).send({message: "User is not authorized for this data"});
        return;
    }

    const topicId = req.params.topicId;

    if (!topicId) {
        res.status(400).send({message: "Bad request. Topic ID is required"});
        return;
    }

    try {
        const [result] = await conn.execute<Deck[]>(
            `SELECT deck_id, deck_name, deck_desc, created_at FROM decks WHERE topic_id =?`, [topicId]
        );

        console.log(`Decks received for topic with topic ID: ${topicId}`);

        res.status(200).send(JSON.stringify(result));
    } catch (e) {
    
        console.log(e);
        res.status(500).send({ message: 'Internal server error. Please try later.'});
        return;

    }
});

//Create a new deck from a Topic
app.post('/api/decks/:topicId', async (req: Request, res: Response) => {
    
    if(!req.session.user || !req.session.user.id || !req.session.user.email) {
        res.status(401).send({message: "User is not authorized for this data"});
        return;
    }

    const { deckName, deckDesc } = req.body;
    const topicId = req.params.topicId;

    if (!deckName || !topicId) {
        res.status(401).send({message: "The Deck name is required to create a new deck"});
        return;
    }

    try {
        await conn.execute(
            `INSERT INTO decks (topic_id, deck_name, deck_desc)
                VALUES (?,?,?)`, [topicId, deckName, deckDesc]
        );

        console.log(`New deck created with name ${deckName}`);
        
        res.status(200).send({ message: `Successfully created Deck with name: ${deckName}` });
        return; 

    } catch (e) {

        console.log(e);
        res.status(500).send({ message: 'Internal server error. Please try later.'});
        return;

    }
});

//Update an existing Deck of topicId
app.put('/api/decks/:deckId/:topicId', async(req: Request, res: Response) => {
    
    if (!req.session?.user || !req.session.user.id || !req.session.user.email) {
        res.status(401).send({ message: "User is not authorized to update decks."});
        return;
    }

    const {deckName, deckDesc} = req.body;
    const topicId = req.params.topicId;
    const deckId = req.params.deckId;

    if(!topicId || !deckId) {
        res.status(401).send({message: "Invalid request. The topic ID and the deck ID is required to update a deck"});
    }

    try {
        await conn.execute(
            `UPDATE decks
                SET deck_name = ?, deck_desc = ?
                WHERE deck_id = ? AND topic_id = ?`, [deckName, deckDesc, deckId, topicId]
        );

        res.status(200).send({ message: `Successfully updated topic with deck id: ${deckId}`});
        return;

    } catch (e) {

        console.log(e);
        res.status(500).send({ message: 'Internal server error. Please try later.'});
        return;

    }

});

//Delete a Deck of deckId and topicId
app.delete('/api/decks/:deckId/:topicId', async (req: Request, res: Response) => {
   
    if (!req.session?.user || !req.session.user.id || !req.session.user.email) {
        res.status(401).send({ message: "User is not authorized to delete decks."});
        return;
    }

    const topicId = req.params.topicId;
    const deckId = req.params.deckId;

    if (!topicId || !deckId) {
        res.status(401).send({message: "Invalid request. The topic ID and the deck ID is required to delete a deck"});
    }
    await conn.beginTransaction();
    try {

        await deleteFlashcardsForDeck(deckId);
        
        await conn.execute(
            `DELETE FROM decks 
                WHERE deck_id = ? AND topic_id = ?`, [deckId, topicId]
        );

        res.status(200).send({ message: `Successfully deleted deck which had the id: ${deckId}` });
        return;

    } catch (e) {

        console.log(e);
        res.status(500).send({ message: 'Internal server error. Please try later.'});
        return;

    }
});

//Function used to delete all the Flashcards for a given deck
async function deleteFlashcardsForDeck(deckId: string) {
    const [flashcardDelRes] = await conn.execute(
                `DELETE f 
                FROM flashcards f 
                JOIN (
                    SELECT flashcard_id FROM flashcards WHERE deck_id = ?
                ) t 
                ON f.flashcard_id = t.flashcard_id 
                WHERE f.deck_id = ?`, [deckId, deckId]
            );

        const numAffectedFlashcards = (flashcardDelRes as ResultSetHeader).affectedRows;
        console.log(`${numAffectedFlashcards} flashcards affected`);
}


interface Flashcard extends RowDataPacket {
    flashcardId: number,
    correctCheck: boolean,
    question: string,
    answer: string,
    createdAt: Date,

    deckId: string //testing
}

app.get('/api/flashcards/:deckId', async (req: Request, res: Response) => {

    if (!req.session?.user || !req.session.user.id || !req.session.user.email) {
        res.status(401).send({ message: "User is not authorized to see these flashcards."});
        return;
    }

    const deckId = req.params.deckId;

    if (!deckId) {
        res.status(400).send({message: "Invalid Request. Deck ID is required"});
    }

    try {
        const [result] = await conn.execute<Flashcard[]>(`
            SELECT flashcard_id, correct_check, question, answer, created_at, deck_id FROM flashcards WHERE deck_id = ?
            `, [deckId]
        );
        
        console.log(`Flashcards received for Deck with ID: ${deckId}`);

        res.status(200).send(JSON.stringify(result));

    } catch (e) {

        console.log(e);
        res.status(500).send({ message: 'Internal server error. Please try later.'});
        return;

    }
});

//What things are needed when creating a flashcard?
// deck_id, question, answer 
app.post('/api/flashcards/:deckId', async (req: Request, res: Response) => {
    
    if (!req.session?.user || !req.session.user.id || !req.session.user.email) {
        res.status(401).send({ message: "User is not authorized to create a flashcard."});
        return;
    }

    const {question, answer} = req.body; 
    const deckId = req.params.deckId;
    const correctCheck = false;

 

    if (!deckId || !question || !answer) {
        res.status(400).send({message: "Invalid Request. Deck ID, question, answer is required to create a new Flashcard"});
    }

    try {
        const [rawResult] = await conn.execute(
            `INSERT INTO flashcards(question, answer, deck_id, correct_check)
                VALUES(?,?,?,?)`, [question,answer,deckId, correctCheck]
        );

        const result = rawResult as ResultSetHeader;
        res.status(200).send({message: `Flashcard inserted with ID: ${result.insertId}`})
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Internal server error. Please try later.'});
        return;
    }


});

app.put('/api/flashcards/:flashcardId/:deckId', async (req: Request, res: Response) => {

    if (!req.session?.user || !req.session.user.id || !req.session.user.email) {
        res.status(401).send({ message: "User is not authorized to update the flashcard."});
        return;
    }

    const flashcardId = req.params.flashcardId;
    const deckId = req.params.deckId;
    const {question, answer} = req.body;
    const correctCheck = false; // Newly updated flashcard will not be considered as having been correctly answered.

    if (!flashcardId || !deckId || !question || !answer) {
        res.status(400).send({message: "Invalid Request. Deck ID, Flashcard ID, question, answer is required to upate a Flashcard"});
        return;
    }
    
    try {
            await conn.execute(
                `UPDATE flashcards 
                    SET question = ?, answer = ?, correct_check = ?
                    WHERE flashcard_id = ? AND deck_id = ?`, [question, answer, correctCheck, flashcardId, deckId]
            );

            res.status(200).send({message: `Successfully updated flashcard with ID: ${flashcardId}`});

    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Internal server error. Please try later.'});
        return;
    }

});

app.delete('/api/flashcards/:flashcardId/:deckId', async (req: Request, res: Response) => {

    if (!req.session?.user || !req.session.user.id || !req.session.user.email) {
        res.status(401).send({ message: "User is not authorized to delete the flashcard."});
        return;
    }

    const flashcardId = req.params.flashcardId;
    const deckId = req.params.deckId;

    if (!flashcardId || !deckId) {
        res.status(400).send({message: `Invalid Request. Flashcard ID and Deck ID are required for deleting a Flashcard`});
    }

    try {
        await conn.execute(
            `DELETE FROM flashcards WHERE flashcard_id = ? AND deck_id = ?`, [flashcardId, deckId]
        );

        res.status(200).send({message: `Flashcard with ID: ${flashcardId} successfully deleted`});

    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Internal server error. Please try later.'});
        return;
    }
 
});




// TODO: log the user out if the user doesn't have the session ID in any API call. 

async function logOutUser(req: Request): Promise<void> {

    return new Promise((resolve, reject) => {
        req.session.destroy( (err) => {
            if (err) {
                console.log(`Logout Error for user: ${req.session.user?.email}; message: ${err}`);
                reject(err);
            } else {
                resolve();
            }
        });
    });
    

}
