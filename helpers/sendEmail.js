import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

const { UKR_NET_EMAIL } = process.env;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const msg = { ...data, from: UKR_NET_EMAIL };
  try {
    await sgMail.send(msg);
    console.log("Email sent");
  } catch (error) {
    console.error(error);
  }
};

export default sendEmail;
