import app from './app';
import Cron from './cron/cron';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';

// initialize environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err : any) => {
    if (err) {
        throw err
    }
    console.log('Express server listening on port ' + PORT);

    // initiate cron task

    const dataAnalyserCron = new Cron('perhour');
    dataAnalyserCron.startJob(); // run task every hour

    const summaryTaskCron = new Cron('perday');
    summaryTaskCron.startJob();
})




const gracefulShutdown = (err) => {
    const timestamp = Date.now();
    if (err) {
        console.info(`ProcessId: ${timestamp} uncaughtException: ${err.message}`);
        console.info(`ProcessId: ${timestamp} Shutting down gracefully.`);

        console.error(`ProcessId: ${timestamp} uncaughtException: ${err.message}`);
        console.error(`ProcessId: ${timestamp}`, err.stack);
    } else {
        console.info(`ProcessId: ${timestamp} Received kill signal, shutting down gracefully.`);
    }

    mongoose
        .connection
        .close(() => {
            console.info('Mongoose default connection disconnected through app termination');
            // process.exit(0);
        });
    // Wait for 20 second to close all open connections and processes before hard
    // shutdown
    setTimeout(() => {
        console.error(`Could not close connections in time, forcefully shutting down. ProcessId: ${timestamp}`);
        console.info('Shutting Down Forcefully');
        process.exit(1);
    }, 20 * 1000);
};

// listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown);

// uncaughtException Exception
process.on('uncaughtException', gracefulShutdown);