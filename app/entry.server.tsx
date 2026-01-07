import type { RenderToPipeableStreamOptions } from "react-dom/server";
import { renderToPipeableStream } from "react-dom/server";
import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";
import { PassThrough } from "stream";

const ABORT_DELAY = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  entryContext: EntryContext,
  _loadContext: AppLoadContext
) {
  // Handle Chrome DevTools requests silently
  const url = new URL(request.url);
  if (url.pathname.startsWith("/.well-known/")) {
    return Promise.resolve(
      new Response(null, {
        status: 404,
        headers: responseHeaders,
      })
    );
  }

  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const userAgent = request.headers.get("user-agent");

    const readyOption: keyof RenderToPipeableStreamOptions =
      userAgent && isbot(userAgent) ? "onAllReady" : "onShellReady";

    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={entryContext} url={request.url} />,
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = new ReadableStream({
            start(controller) {
              body.on("data", (chunk: Buffer) => {
                controller.enqueue(new Uint8Array(chunk));
              });
              body.on("end", () => {
                controller.close();
              });
            },
            cancel() {
              body.destroy();
            },
          });

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
