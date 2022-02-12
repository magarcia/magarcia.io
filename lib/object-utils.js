export function flatten(object, keyJoiner = (k1, k2) => `${k1}.${k2}`) {
  return Object.entries(object).reduce((acc, [key, value]) => {
    if (typeof value === 'object' && value !== null) {
      const flatValue = flatten(value);
      for (let [k, v] of Object.entries(flatValue)) {
        acc[keyJoiner(key, k)] = v;
      }
    } else {
      acc[key] = value;
    }

    return acc;
  }, {});
}
