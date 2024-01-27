export default async function (filename) {
  const path = `./telegram-bot__template-messages/${filename}.md`;
  const file = Bun.file(path);
  return await file.text();
}
