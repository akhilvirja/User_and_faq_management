import nodemailer from "nodemailer"

async function sendEmailVerificationEmail(email, token){

    // const link = `${process.env.LIVE_URL}/verify-email?token=${token}`;
    const link = `http://localhost:8000/user/verify-email?token=${token}`;

    let transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    })

    let mailOptions = {
        from: "User and faq management system <no-reply@gmail.com>",
        to: email,
        subject: "Email Verification",
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>Email Verification</h2>
                <p>Hello,</p>
                <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
                <p style="text-align: center;">
                    <a href="${link}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
                </p>
                <p>If the button doesn't work, copy and paste the following link into your browser:</p>
                <p><a href="${link}">${link}</a></p>
                <br>
                <p>Thank you,<br>The User & FAQ Management Team</p>
            </div>
        `
    }

    let mailifo = await transport.sendMail(mailOptions)
}

export {
    sendEmailVerificationEmail,
}