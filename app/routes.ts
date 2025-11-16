import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route(":slug", "routes/$slug.tsx"),
  route("tags/:tag", "routes/tags.$tag.tsx"),
] satisfies RouteConfig;
