import * as dotenv from 'dotenv';

// initialize environment variables
dotenv.config();

import * as SendGrid from 'sendgrid';

export class SendGridMail extends SendGrid.mail.Mail {}
export class SendGridEmail extends SendGrid.mail.Email {}
export class SendGridContent extends SendGrid.mail.Content {}
export class SendGridHelper extends SendGrid.mail.Personalization {}

export const sendMail = (recipients, subject, mailTemplate, options, bccrecipients) => {

    let sendGrid : any = SendGrid(process.env.SENDGRID_KEY);
    let mail : SendGridMail = new SendGridMail();
    let personalization : SendGridHelper = new SendGridHelper();

    options = options || {};
    options.contentType = options.contentType || 'text/plain';
    // Creating mail object

    const fromEmail = new SendGridEmail('support@indracyrptocapital.io', 'Daily crypto summary');
    mail.setFrom(fromEmail);
    mail.setSubject(subject);

    if (recipients.constructor === Array) {
        recipients.forEach((recipient) => {
            personalization.addTo(new SendGridEmail(recipient));
        });
    } else {
        personalization.addTo(new SendGridEmail(recipients));
    }
    if (bccrecipients) {
        if (bccrecipients.constructor === Array) {
            bccrecipients.forEach((bccrecipients) => {
                personalization.addBcc(new SendGridEmail(bccrecipients));
            });
        } else {
            personalization.addBcc(new SendGridEmail(bccrecipients));
        }
    }

    mail.addPersonalization(personalization);

    const content = new SendGridContent(options.contentType, mailTemplate);
    mail.addContent(content);

    let request = sendGrid.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    return sendGrid
        .API(request)
        .then((response) => {
            console.info(response.statusCode);
            console.info(response.body);
            console.info(response.headers);
            return response;
        });
}
