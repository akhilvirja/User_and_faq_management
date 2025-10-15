import nodemailer from "nodemailer"

async function sendWelcomeEmail(username, email){
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
                subject: "Welcome to Our Service!",
                html: `
                    <h1>Welcome, ${username}!</h1>
                    <p>Thank you for joining us. We're excited to have you on board.</p>
                    <p>If you have any questions, feel free to reply to this email.</p>
                    <br>
                    <p>Best Regards,<br>Your Company Team</p>
                `
            }
    
            return await transport.sendMail(mailOptions)
}

export {
    sendWelcomeEmail,
}