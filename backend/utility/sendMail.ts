import nodemailer from "nodemailer";

const sendMail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ID,
    pass: process.env.GMAIL_PASSWORD,
  },
});

let message = {
  from: process.env.GMAIL_ID,
  to: userEmail,
  subject: subject,
  html: content,
};
export const studnetMail=async(userEmail:string,subject:string,content:string)=>{
  try {
    await sendMail.sendMail(message, (err, info) => {
      if (err) {
        console.log("Error occurred. " + err.message);
        return;
      }
      console.log("Message sent: %s", info.messageId);
    });
  } catch (error) {
    console.log("Error sending email:", error);
  }
