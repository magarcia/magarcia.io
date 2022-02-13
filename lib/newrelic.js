export function report(data) {
  return fetch(
    `${process.env.NEW_RELIC_INSIGHTS_URL}/v1/accounts/${process.env.NEW_RELIC_ACCOUNT_ID}/events`,
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
