export const server = Bun.serve({
  port: process.env.PORT,
  fetch(req) {
    const pathname__skipped = ["/manifest.json", "/favicon.ico"];
    const url = new URL(req.url);
    const { pathname } = url;

    if (pathname === "/")
      return new Response(Bun.file(`./web-app__html/index.html`));
    else if (!pathname__skipped.includes(pathname))
      return new Response(Bun.file(`./web-app__html${pathname}`));
    else return;
  },
});

console.log(`web app server started`);
