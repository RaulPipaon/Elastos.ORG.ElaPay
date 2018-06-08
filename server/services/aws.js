import AWS from 'config/aws'
import { AWS as AWS_CONFIG } from 'config/config';

/*
* @subject: string
* @toAddresses: array email []
* @ccAddresses: array email []
* @htmlFormatBody: html format
* @textFormatBody: string format


*Example for other file call service sendMail
*import {sendMail} from 'services/aws';

*const subject = 'Subject';
*const toAddresses = ['hoang@gmail.com'];
*const ccAddresses = ['hoang@gmail.com'];
*const htmlFormatBody = '<p>aaaaaaa</p>';
*const textFormatBody = 'aaaaaaaaaaaaaa';

*sendMail(subject, toAddresses, ccAddresses, htmlFormatBody, textFormatBody);
*/

export function sendMail(subject, toAddresses, ccAddresses, htmlFormatBody, textFormatBody) {
    // Create sendEmail params template
    var params = {
        Destination: { // required
            CcAddresses: ccAddresses,
            ToAddresses: toAddresses
        },
        Message: { // required
            Body: { // required
                Html: {
                    Charset: "UTF-8",
                    Data: htmlFormatBody
                },
                Text: {
                    Charset: "UTF-8",
                    Data: textFormatBody
                    }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject
            }
        },
        // Host: 'email-smtp.us-west-2.amazonaws.com',
        Source: AWS_CONFIG.sourceMailAws, // required
        ReplyToAddresses: [],
    }

    const ses = new AWS.SES({apiVersion: '2010-12-01'});

    return ses.sendEmail(params).promise();
}
