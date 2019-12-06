export default function parse_args(args: string[]) {
  let result = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    result[key] = args[i + 1];
  }

  return result;
}
