const nodemailer = require('nodemailer');

const sendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        auth: {
            user: process.env.NEXT_PUBLIC_EMAIL_USER,
            pass: process.env.NEXT_PUBLIC_EMAIL_PASS
        },
    });

    const mailOptions = {
        from: process.env.NEXT_PUBLIC_EMAIL_USER,
        to: options.to,
        subject: options.subject,
        html: options.html
    };

    await transporter.sendMail(mailOptions);
};

export { sendMail };