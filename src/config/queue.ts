import Queue from "bull";
import Mailer from "~/config/mailer";
const redisConfig = {
  port: Number(process.env.REDIS_PORT || "6379"),
  host: process.env.REDIS_HOST || "localhost",
  password: process.env.REDIS_PASSWORD || undefined
};

export const mailQueue = new Queue("mailers", {
  redis: redisConfig
});

mailQueue.process(async (job) => {
  console.log(`=======----------------------------------------------------------------`);
  const { data } = job;
  const mailer = new Mailer({
    subject: data.subject,
    receiver: data.receiver
  });
  console.log(`Processing mailer`);
  await mailer.send(data);
  console.log(`=======----------------------------------------------------------------`);
});
