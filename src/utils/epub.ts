import { EpubParser, EpubBook } from "@ridi/epub-parser";

export interface EPubInfo {
  base: EpubBook;
  coverImage: string | Buffer;
}

export async function getEPubMetadata(path): Promise<EPubInfo> {
  const parser = new EpubParser(path);
  return new Promise((resolve, reject) => {
    parser
      .parse()
      .then((base: EpubBook) => {
        const cover =
          base.cover || base.images.find((image) => image.id === "cover-image");

        resolve({
          base,
          coverImage: parser.readItem(cover),
        });
      })
      .catch(reject);
  });
}
