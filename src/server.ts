import app from './app';

import {logic} from './logic';
import {emailTemplate} from './template/emailTemplate';
import{sendMail}  from './services/sendgrid'
const PORT = 3000;

app.listen(PORT, (err : any) => {
    if (err) {
        throw err
    }
    console.log('Express server listening on port ' + PORT);

    // initiate logic
    logic().then((data) => {
        console.log(data);
       
    }).catch((e) => {
        console.log(e, "error in logic call");
    })
});




const subject = 'Cyrpto daily summary';
const email = 'yogeshwar607@gmail.com'; //gsampathkumar@gmail.com
const bccemail = 'yy@gmail.com';

const template = emailTemplate();
sendMail([email], subject, template, { contentType: 'text/html' }, bccemail);