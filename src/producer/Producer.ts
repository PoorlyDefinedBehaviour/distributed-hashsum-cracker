import amqp from "amqplib";
import variation_stream from "variations-stream";

async function start_producer(): Promise<void> {
  console.log(`Starting producer with pid => ${process.pid}`);

  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const { max_key_length, batch_size } = process.env;

  let batch: string[] = [];

  const send_permutations = () => {
    channel.sendToQueue("jobs", Buffer.from(JSON.stringify({ batch })));
  };

  variation_stream(alphabet, max_key_length)
    .on("data", (permutation: string) => {
      batch.push(permutation);

      if (batch.length === parseInt(batch_size!)) {
        send_permutations();
        batch = [];
      }
    })
    .on("end", (_: string) => send_permutations());
}
start_producer();
