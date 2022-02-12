import UAParser from 'ua-parser-js';

export function useragent(request) {
  const ua = new UAParser(request.headers.get('user-agent'));
  const { ua: userAgent, ...rest } = ua.getResult();
  return { userAgent, ...rest };
}

export function acceptHeaders(request) {
  return {
    accept: request.headers.get('accept'),
    acceptLanguage: request.headers.get('accept-language'),
    acceptEncoding: request.headers.get('accept-encoding'),
  };
}

export function geoip(request) {
  return {
    country: request.geo.country,
    city: request.geo.city,
    region: request.geo.region,
  };
}
