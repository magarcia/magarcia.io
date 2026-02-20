---
name: rr7-testing
description: |
  Testing React Router 7 applications with Vitest and Playwright. Use when
  writing unit tests for loaders/actions, testing route components, setting up
  test utilities, or writing E2E tests. Triggers on: "test route", "test loader",
  "test action", "test component", "vitest react router", "playwright react router",
  "createRoutesStub", "testing react router".
allowed-tools:
  - Read
  - Edit
  - Write
  - Grep
  - Glob
  - Bash
---

# Testing React Router 7

Guide for testing React Router 7 framework mode applications.

## Unit Testing (Vitest)

### Testing Loaders

Loaders are plain async functions — test them directly:

```ts
import { describe, it, expect } from "vitest";
import { loader } from "./product";

describe("product loader", () => {
  it("returns product data", async () => {
    const request = new Request("http://localhost/products/123");
    const params = { id: "123" };

    const result = await loader({
      request,
      params,
      context: {},
    } as any);

    expect(result).toEqual({
      name: "Widget",
      price: 9.99,
    });
  });

  it("throws 404 for missing product", async () => {
    const request = new Request("http://localhost/products/999");
    const params = { id: "999" };

    await expect(
      loader({ request, params, context: {} } as any)
    ).rejects.toThrow();
  });
});
```

### Testing Actions

```ts
import { describe, it, expect } from "vitest";
import { action } from "./new-post";

describe("new-post action", () => {
  it("creates a post and redirects", async () => {
    const formData = new FormData();
    formData.set("title", "Test Post");
    formData.set("body", "Content here");

    const request = new Request("http://localhost/posts", {
      method: "POST",
      body: formData,
    });

    const result = await action({
      request,
      params: {},
      context: {},
    } as any);

    // Check redirect
    expect(result.status).toBe(302);
    expect(result.headers.get("Location")).toMatch(/\/posts\/\w+/);
  });

  it("returns validation errors", async () => {
    const formData = new FormData();
    // Missing required fields

    const request = new Request("http://localhost/posts", {
      method: "POST",
      body: formData,
    });

    const result = await action({
      request,
      params: {},
      context: {},
    } as any);

    expect(result.errors).toBeDefined();
    expect(result.errors.title).toBe("Title is required");
  });
});
```

### Testing Components with `createRoutesStub`

Use `createRoutesStub` to render route components with full data loading:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import ProductPage, { loader } from "./product";

describe("ProductPage", () => {
  it("renders product details", async () => {
    const Stub = createRoutesStub([
      {
        path: "/products/:id",
        Component: ProductPage,
        loader() {
          return { name: "Widget", price: 9.99 };
        },
      },
    ]);

    render(<Stub initialEntries={["/products/123"]} />);

    expect(await screen.findByText("Widget")).toBeInTheDocument();
    expect(screen.getByText("$9.99")).toBeInTheDocument();
  });

  it("renders error boundary on 404", async () => {
    const Stub = createRoutesStub([
      {
        path: "/products/:id",
        Component: ProductPage,
        ErrorBoundary: ProductPage.ErrorBoundary,
        loader() {
          throw new Response("Not Found", { status: 404 });
        },
      },
    ]);

    render(<Stub initialEntries={["/products/999"]} />);

    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });
});
```

### Testing Components with React Router Hooks

For components that use `useNavigate`, `useParams`, `useSearchParams`:

```tsx
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import MyComponent from "./MyComponent";

function renderWithRouter(component: React.ReactNode, { route = "/" } = {}) {
  const router = createMemoryRouter(
    [{ path: "*", element: component }],
    { initialEntries: [route] }
  );
  return render(<RouterProvider router={router} />);
}

it("navigates on button click", async () => {
  renderWithRouter(<MyComponent />, { route: "/start" });
  // test navigation behavior
});
```

### Testing Forms and Actions

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import NewPost, { action } from "./new-post";

it("submits the form", async () => {
  const user = userEvent.setup();
  let actionCalled = false;

  const Stub = createRoutesStub([
    {
      path: "/posts/new",
      Component: NewPost,
      async action({ request }) {
        actionCalled = true;
        const formData = await request.formData();
        expect(formData.get("title")).toBe("My Post");
        return { ok: true };
      },
    },
  ]);

  render(<Stub initialEntries={["/posts/new"]} />);

  await user.type(screen.getByLabelText("Title"), "My Post");
  await user.click(screen.getByRole("button", { name: /create/i }));

  expect(actionCalled).toBe(true);
});
```

### Mocking Server Modules

For `.server` modules that can't run in test environment:

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    alias: {
      "~/db.server": "./tests/mocks/db.ts",
    },
  },
});

// tests/mocks/db.ts
export const db = {
  product: {
    findMany: vi.fn().mockResolvedValue([]),
    findUnique: vi.fn().mockResolvedValue(null),
    create: vi.fn(),
  },
};
```

---

## End-to-End Testing (Playwright)

### Setup

```ts
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  webServer: {
    command: "npm run dev",
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://localhost:5173",
  },
});
```

### Testing Navigation

```ts
import { test, expect } from "@playwright/test";

test("navigates between pages", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Home/);

  await page.click('a[href="/about"]');
  await expect(page).toHaveURL("/about");
  await expect(page.locator("h1")).toHaveText("About");
});
```

### Testing Loaders (Data Display)

```ts
test("displays blog posts from loader", async ({ page }) => {
  await page.goto("/blog");

  // Loader data renders on the page
  const posts = page.locator("article");
  await expect(posts).toHaveCount(10);
  await expect(posts.first()).toBeVisible();
});
```

### Testing Forms and Actions

```ts
test("submits contact form", async ({ page }) => {
  await page.goto("/contact");

  await page.fill('input[name="name"]', "Test User");
  await page.fill('input[name="email"]', "test@example.com");
  await page.fill('textarea[name="message"]', "Hello!");
  await page.click('button[type="submit"]');

  // After action redirect
  await expect(page).toHaveURL("/contact/thanks");
  await expect(page.locator("h1")).toHaveText("Thank you");
});
```

### Testing Error Boundaries

```ts
test("shows error boundary for missing pages", async ({ page }) => {
  await page.goto("/nonexistent-page");

  await expect(page.locator("h1")).toContainText("404");
});
```

### Testing Pre-rendered Pages

```ts
test("pre-rendered pages load without JS", async ({ page }) => {
  // Disable JavaScript to verify SSR/pre-render content
  await page.route("**/*.js", (route) => route.abort());

  await page.goto("/about");
  await expect(page.locator("h1")).toHaveText("About");
});
```

---

## Test Organization

```
tests/
├── unit/
│   ├── loaders/        # Loader function tests
│   ├── actions/        # Action function tests
│   └── components/     # Component unit tests
├── integration/
│   └── routes/         # Route module tests with createRoutesStub
├── e2e/
│   ├── navigation.spec.ts
│   ├── forms.spec.ts
│   └── errors.spec.ts
└── mocks/
    ├── db.ts           # Database mocks
    └── handlers.ts     # MSW request handlers (optional)
```

## Key Patterns

1. **Test loaders/actions as plain functions** — they accept Request and return
   data. No special setup needed.
2. **Use `createRoutesStub` for integration tests** — renders route components
   with fake loaders/actions.
3. **Mock `.server` imports** — alias them in vitest config to test mocks.
4. **Use Playwright for full user flows** — navigation, forms, error states.
5. **Test pre-rendered content without JS** — verify SSR output is complete.
