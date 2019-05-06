Crypto Analyser Report 

There are two cron jobs running.One runs every hour for data analysing 
and other one runs once per day and send summary email. 

Please create file name .env in root folder and paste env value which you can get from admin and after that run the code.k
Replace mongodb url and sendgrid api key in .env file with yours

Commands to run
 
    Install node_modules
    `npm i`

    Dev server
    `ts-node ./src/server.ts`

    Prod Server
    `npm run build && npm run start`

You can use PM2 / any other process manager to run node.

