import nodemailer from 'nodemailer';
import { SMTP } from './config';

let transporter = nodemailer.createTransport({
    host: SMTP.host,
    port: SMTP.port,
    secure: SMTP.secure,
    auth: {
        user: SMTP.user,
        pass: SMTP.pass
    }
});

export default transporter;
