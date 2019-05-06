import app from './app';
import Cron from './cron/cron';
import * as dotenv from 'dotenv';


import {schedule, ScheduleOptions, ScheduledTask} from 'node-cron';
import {parseExpression} from 'cron-parser';

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
});


