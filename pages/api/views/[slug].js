const authorization = "token aeab7d21-f3b7-4f0c-b297-a5afd1b05d40";
const store = "https://jsonbin.org/magarcia/blog";

async function getViews(slug) {
  const { views = 1 } =
    (await fetch(`${store}/${slug}`, {
      headers: { authorization },
    }).then((res) => res.json())) ?? {};

  return views;
}

async function updateViews(slug) {
  const postData = await fetch(`${store}/${slug}`, {
    headers: { authorization },
  }).then((res) => res.json());

  const views = (postData?.views ?? 0) + 1;

  await fetch(`${store}/${slug}`, {
    method: !postData ? "POST" : "PATCH",
    headers: { authorization },
    body: JSON.stringify({ views }),
  }).then((res) => res.json());

  return views;
}

export default async function handler(req, res) {
  try {
    const slug = req.query.slug.toString();

    if (req.method === "POST") {
      const views = await updateViews(slug);
      return res.status(200).json({
        total: views,
      });
    }

    if (req.method === "GET") {
      const views = await getViews(slug);

      return res.status(200).json({ total: views.toString() });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}
