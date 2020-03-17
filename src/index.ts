import "reflect-metadata";
import {createConnection} from "typeorm";
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';

const app: express.Application = express();
const port: number = Number(process.env.PORT) || 3001;

app.use(bodyParser.json());

(async () => {
    await createConnection();
    routes(app);
    app.listen(port, (err: Error) => {
        if (err) {
            console.error(err);
        } else {
            console.log('NODE_ENV =', process.env.NODE_ENV);
        }
    });
})();
