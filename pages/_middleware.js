import { NextResponse } from "next/server";

function report(data) {
  return fetch(
    `https://insights-collector.eu01.nr-data.net/v1/accounts/${process.env.NEW_RELIC_ACCOUNT_ID}/events`,
    {
      body: JSON.stringify({ ...data, eventType: "ResourceFetch" }),
      headers: {
        "Api-Key": process.env.NEW_RELIC_API_KEY,
        "Content-Type": "application/json",
      },
      method: "POST",
    }
  )
    .then(() => console.log(`${data.eventType} reported`))
    .catch(() =>
      console.error(`An error ocurred reporting ${data.eventType}`, data)
    );
}

export async function middleware(request, event) {
  const { nextUrl: url, geo } = request;
  const country = geo.country;
  const city = geo.city;
  const region = geo.region;
  const userAgent = request.headers.get("user-agent");
  const acceptLanguage = request.headers.get("accept-language");
  const accept = request.headers.get("accept");
  const acceptEncoding = request.headers.get("accept-encoding");
  const referrer = request.headers.get("referer");
  const pathname = url.pathname;
  const href = url.href;
  const destination = request.headers.get("sec-fetch-dest");

  event.waitUntil(
    (async () => {
      const data = {
        country,
        city,
        region,
        userAgent,
        referrer,
        pathname,
        href,
        acceptLanguage,
        accept,
        acceptEncoding,
        destination,
        environment: process.env.VERCEL_ENV,
      };
      if (
        ["document", "empty"].includes(destination) &&
        pathname.indexOf("/api") !== 0
      ) {
        await report({ ...data, eventType: "PageView" });
      } else {
        await report({ ...data, eventType: "ResourceFetch" });
      }
    })()
  );

  return NextResponse.rewrite(url);
}
