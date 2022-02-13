import { NextResponse } from "next/server";

import fingerprint from "../lib/fingerprint";
import { capitalize } from "../lib/string-utils";
import { geoip, useragent, acceptHeaders } from "../lib/request-utils";
import { report } from "../lib/newrelic";
import { flatten } from "../lib/object-utils";

function url(request) {
  return {
    href: request.nextUrl.href,
    pathname: request.nextUrl.pathname,
    referrer: request.headers.get("referer"),
    destination: request.headers.get("sec-fetch-dest"),
  };
}

function getTrackingData(request) {
  return flatten(
    {
      ...acceptHeaders(request),
      ...geoip(request),
      ...url(request),
      ...useragent(request),
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
      fingerprint: fingerprint(request),
    },
    (k1, k2) => k1 + capitalize(k2)
  );
}

export async function middleware(request, event) {
  
  event.waitUntil(
    (async () => {
      const data = getTrackingData(request);
      await report({ ...data, eventType: "ResourceFetch" });
    })()
  );

  return NextResponse.next();
}
