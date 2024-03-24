import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

const { UKR_NET_EMAIL, BASE_URL, SENDGRID_TEMPLATE_ID } = process.env;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (email) => {
  const msg = {
    from: {
      email: UKR_NET_EMAIL,
      name: "WaterTracker",
    },
    personalizations: [
      {
        to: [{ email: email }],
        dynamic_template_data: {
          email: email,
          base_url: BASE_URL,
        },
      },
    ],
    template_id: SENDGRID_TEMPLATE_ID,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent");
  } catch (error) {
    console.error(error);
    console.error(error?.response?.body?.errors);
  }
};

export default sendEmail;
