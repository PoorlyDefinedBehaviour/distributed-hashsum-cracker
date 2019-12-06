import amqp from "amqplib";
import { createHash } from "crypto";

async function start_worker(): Promise<void> {
  console.log(`Starting worker with pid => ${process.pid}`);

  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const { target, algo } = process.env;

  const queue_name = "jobs";
  await channel.assertQueue(queue_name);

  channel.consume(queue_name, (message) => {
    const { batch } = JSON.parse(message!.content as any);

    batch &&
      batch.forEach((permutation: string) => {
        const hash = createHash(algo!)
          .update(permutation)
          .digest("hex");

        if (hash === target) {
          channel.sendToQueue(
            "results",
            Buffer.from(JSON.stringify({ target, result: permutation }))
          );
        }
      });
  }, { noAck: true });
}
start_worker();
