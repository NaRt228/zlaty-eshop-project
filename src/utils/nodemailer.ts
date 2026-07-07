import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "zlatyehsop@gmail.com",
    pass: "xxlj lear akla fhig",
  }
});
