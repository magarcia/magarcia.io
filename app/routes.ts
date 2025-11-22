import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx", { id: "index" }),
  route("es", "routes/_index.tsx", { id: "index-es" }),
  route("ca", "routes/_index.tsx", { id: "index-ca" }),

  route("about", "routes/about.tsx", { id: "about" }),

  route(":slug", "routes/$slug.tsx", { id: "post" }),
  route(":lang/:slug", "routes/$slug.tsx", { id: "post-lang" }),

  route("tags/:tag", "routes/tags.$tag.tsx", { id: "tag" }),
  route(":lang/tags/:tag", "routes/tags.$tag.tsx", { id: "tag-lang" }),
] satisfies RouteConfig;
