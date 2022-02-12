export function report(data) {
  return fetch(
    `https://insights-collector.eu01.nr-data.net/v1/accounts/${process.env.NEW_RELIC_ACCOUNT_ID}/events`,
    {
      body: JSON.stringify({ ...data, eventType: 'ResourceFetch' }),
      headers: {
        'Api-Key': process.env.NEW_RELIC_API_KEY,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
  )
    .then(() => console.log(`${data.eventType} reported`))
    .catch(() =>
      console.error(`An error ocurred reporting ${data.eventType}`, data),
    );
}
