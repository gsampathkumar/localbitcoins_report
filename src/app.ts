import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as dotenv from 'dotenv';

// initialize environment variables
dotenv.config();

class App {

    public app : express.Application = express();
    
    public mongoUrl : string = process.env.MONGO_URL;

    constructor() {
        if(!this.mongoUrl) throw new Error('Provide valid MONGO_URL')

        this.config();
        this.mongoConnect();
    }

    private config() : void {
        this
            .app
            .use(bodyParser.json());
        this
            .app
            .use(bodyParser.urlencoded({extended: false}));
        // serving static files
        this
            .app
            .use(express.static('public'));
    }

    private mongoSetup() : void {
        mongoose.Promise = global.Promise;
        mongoose
            .connect(this.mongoUrl, {useNewUrlParser: true})
            .then(() => console.log('connected to db'))
            .catch(e => console.log(e))
    }

    private async mongoConnect():Promise<any>{
        await this.mongoSetup();
    }

}

export default new App().app;
