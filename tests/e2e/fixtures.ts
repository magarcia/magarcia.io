import { test as base } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

interface ExtendedFixtures {
  makeAxeBuilder: () => AxeBuilder;
}

export const test = base.extend<ExtendedFixtures>({
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () =>
      new AxeBuilder({ page }).withTags([
        "wcag2a",
        "wcag2aa",
        "wcag21a",
        "wcag21aa",
      ]);
    await use(makeAxeBuilder);
  },
});

export { expect } from "@playwright/test";
