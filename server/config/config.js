export const SERVER_PORT = 3002
export const MONGODB = 'mongodb://localhost/elaPay'
// export const MONGODB = 'mongodb://52.15.131.100:27017/elaPay'

export const AWS = {
    region: 'your-region',
    accessKeyId: 'your-access-key-id',
    secretAccessKey: 'your-secret-access-key',
    sourceMailAws: 'your-email-verify'
}

// SMTP config for send mail with SendGrid
export const SMTP = {
    host: 'smtp.sendgrid.net',
    port: '587',
    secure: false,
    user: 'apikey',
    pass: 'your-pass'
}
