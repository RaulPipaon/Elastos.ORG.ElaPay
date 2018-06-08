import transporter from 'config/nodemailer'

/*Example send mail mailOptions
*setup email data with unicode symbols
*let mailOptions = {
*    from: '"Fred Foo 👻" <foo@example.com>', // sender address
*    to: 'bar@example.com, baz@example.com', // list of receivers
*    subject: 'Hello ✔', // Subject line
*    text: 'Hello world?', // plain text body
*    html: '<b>Hello world?</b>' // html body
*};

*Exmple other file call
*import {sendMail} from 'services/sendmail';
**/

export function sendMail(mailOptions) {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
}
