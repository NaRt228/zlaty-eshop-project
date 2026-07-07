import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "zlatyehsop@gmail.com",
    pass: process.env.EMAIL_PASS || "xxlj lear akla fhig",
  }
});
