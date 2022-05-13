import ePub from 'epubjs';

export function getEPubFileCover(file) {
  const book = ePub(file) as any;

  return book.loaded.cover.then(() => {
   if (!book.cover) {
     return null;
   }
   if (book.archived) {
     return book.archive.createUrl(book.cover, {"base64": book.settings.replacements === "base64"});
   } else {
     return book.cover;
   }
  })
    .then(url => fetch(url))
    .then(res => res.blob())
}

export async function getEPubFileMetaData(file) {
  const book = ePub(file);
  await book.ready

  const {
    title,
    creator: author,
    description,
    pubdate: publishedAt,
    publisher,
    identifier: isbn,
    language,
  } = book?.packaging?.metadata;


  return {
    title,
    author,
    description,
    isbn,
    language,
    publisher,
    publishedAt: Date.parse(publishedAt) ? new Date(publishedAt) : undefined,
  }
}