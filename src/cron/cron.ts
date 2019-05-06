import {schedule, ScheduleOptions, ScheduledTask} from 'node-cron';
import {parseExpression} from 'cron-parser';
import _ from 'lodash';
import * as moment from 'moment';
import * as dotenv from 'dotenv';
import {logic, sendSummary} from '../logic';
dotenv.config()

export default class Cron {

    private options : ScheduleOptions = {
        scheduled: false
    };
    private task : ScheduledTask;
    constructor(type) {
        if (type === "perhour") {
            this.task = schedule(process.env.CRON_EXPRESSION_HOURLY, this.executeDataAnalyserTask, this.options);
        }
        if (type === "perday") {
            this.task = schedule(process.env.CRON_EXPRESSION_DAILY, this.executeSummaryTask, this.options);
        }
    }

    public startJob() {
        this
            .task
            .start();
    }
    private executeDataAnalyserTask = async() => {
        const format = 'YYYY-MM-DD hh:mm:ss';
        console.info(`Starting cron job at: ${moment().format(format)}`);

        // retrieve , analyse and save data to db
        const data = await logic();

        const cronDate = parseExpression(process.env.CRON_EXPRESSION_HOURLY).next();
        console.info(`Finished  executeDataAnalyserTask cron job. Next iteration at: ${moment(cronDate.toDate()).format(format)}`);

    }
    private executeSummaryTask = async() => {
        const format = 'YYYY-MM-DD hh:mm:ss';
        console.info(`Starting cron job at: ${moment().format(format)}`);

        // read from db & send mail
        const data = await sendSummary();

        const cronDate = parseExpression(process.env.CRON_EXPRESSION_DAILY).next();
        console.info(`Finished executeSummaryTask cron job. Next iteration at: ${moment(cronDate.toDate()).format(format)}`);

    }

}