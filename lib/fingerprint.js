import { x64 } from 'murmurhash3js';

import { flatten } from './object-utils';
import { useragent, acceptHeaders, geoip } from './request-utils';

export default function fingerprint(
  request,
  config = {
    parameters: [useragent, acceptHeaders, geoip],
  },
) {
  const components = config.parameters.reduce((acc, param) => {
    const { userAgent, accept, ...rest } = param(request);
    return {
      ...acc,
      ...rest,
    };
  }, {});

  const leaves = Object.values(flatten(components)).filter((x) => !!x);

  return x64.hash128(leaves.join('~~~'));
}
