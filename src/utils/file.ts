import { createWriteStream } from "fs";
import { Stream } from "stream";

export async function saveFile(stream: Stream, path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const writer = createWriteStream(path);

    stream.pipe(writer);

    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}
