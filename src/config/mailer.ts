import "dotenv/config";
import nodemailer from "nodemailer";
import Email from "email-templates";
const isLocal = process.env.APP_ENV === "development";
class Mailer {
  subject: string;
  receiver: string;
  constructor(args: any) {
    this.subject = args.subject || "";
    this.receiver = args.receiver || "";
  }

  config = async () => {
    const emailConfig = process.env;
    return {
      host: emailConfig.SMTP_HOST,
      port: emailConfig.SMTP_PORT,
      // secure: emailConfig.SMTP_SECURE,
      // ssl: true,
      // tsl: true,
      auth: {
        sender: emailConfig.SENDER_EMAIL,
        user: emailConfig.SENDER_USER,
        pass: emailConfig.SENDER_PASS
      }
    };
  };

  send = async (template: any) => {
    try {
      const config = (await this.config()) as any;
      if (!config?.auth?.user) {
        console.log(`Oop, sorry something wrong with mailer configuration`);
        return;
      }
      const data = {
        from: config.auth.sender,
        to: this.receiver,
        subject: this.subject,
        html: template.html
      };

      if (!isLocal) {
        const transporter = nodemailer.createTransport(config);
        await transporter.sendMail(data);
      } else {
        const email = new Email({
          views: { root: template },
          preview: false
        });
        await email.send({ message: data });
      }
    } catch (err: any) {
      console.log(`Oop, something went wrong with sending email.`);
      console.log(err);
    }
  };
}

export default Mailer;
