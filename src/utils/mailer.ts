import { google } from "googleapis";
import * as nodemailer from "nodemailer";

export interface IMailOptions {
  email: string;
  subject: string;
  message: string;
}

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

let AccessToken;
oauth2Client.getAccessToken().then(token => {
  AccessToken = token.token;
}).catch(err => {
  console.log(err);
});

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "barseetbrown@gmail.com",
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    accessToken: AccessToken,
  },
});

export const sendMail = (
  mailOptions: IMailOptions) => {
  const options = {
    from: 'barseetbrown@gmail.com',
    to: mailOptions.email,
    subject: mailOptions.subject,
    text: mailOptions.message
  }
  transport.sendMail(options, function (err, result) {
    if (err) {
      console.log(err)
      return err
    } else {
      transport.close();
      return {
        message: 'Email has been sent: check your inbox!'
      }
    }
  })
}

