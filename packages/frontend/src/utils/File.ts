export async function saveFileToCache(file, directory, filepath) {
    const epubCache = await caches.open(directory)
    epubCache.put(new Request(filepath), new Response(file))
}

export async function loadFileFromCache(directory, filepath) {
  const cache = await caches.open(directory)
  const result = await cache.match(filepath)
  return new File([await result.blob()], filepath)
}


export async function getCacheStorageObjectUrl(directory, filepath) {
  const cache = await caches.open(directory)
  const result = await cache.match(filepath)
  return URL.createObjectURL(await result.blob())
}
