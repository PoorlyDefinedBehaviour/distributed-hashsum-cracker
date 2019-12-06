import amqp from "amqplib";
import parse_args from "./utils/ParseArgs";
import { fork, ChildProcess } from "child_process";

async function main(): Promise<void> {
  const args = parse_args(process.argv.slice(2));
  console.log("args", args);

  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue_name = "results";
  await channel.assertQueue(queue_name);

  channel.consume(queue_name, (message) => {
    console.log(message!.content.toString());
    channel.deleteQueue("jobs");
    channel.deleteQueue("results");
    channel.removeAllListeners();
    connection.close();
    process.exit();
  }, { noAck: true });

  const children: ChildProcess[] = [];

  process.on("exit", () =>
    children.forEach((child) => child.kill())
  );

  children.push(fork("src/producer/Producer.ts", [], {
    detached: true,
    env: {
      batch_size: args["--batch"],
      max_key_length: args["--max-key-length"]
    }
  }));

  const workers = parseInt(args["--workers"]);
  for (let i = 0; i < workers; ++i) {
    children.push(fork("src/worker/Worker.ts", [], {
      detached: true,
      env: {
        target: args["--target"],
        algo: args["--algo"]
      }
    }));
  }
}
main();
