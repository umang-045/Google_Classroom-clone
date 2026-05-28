import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

export const sendOTPEmail = async (email: string, otp: string) => {
    try {
        await transporter.sendMail({
            from:process.env.SMTP_USER,
            to:email,
            subject:"VERIFY YOUR EMAIL",
            html:`<p>Your OTP is <b>${otp}</b>.<br/> It expires in 10 minutes.</p><br/><b>Don't share it with anyone</b>`,
        })
        console.log("Email Sent")
    }
    catch(err){
        console.log("Error while sending email:",err);
    }
}