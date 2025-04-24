import express, { Request, Response} from 'express';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, typescript express!');
});

app.listen(port, () => {
    console.log(`server running at localhost:${port}`);
});



