import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSub,
} from "@/components/ui/dropdown-menu";
import { createRef } from "react";

describe("DropdownMenuLabel", () => {
  it("renders text content", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(await screen.findByText("My Account")).toBeInTheDocument();
  });

  it("applies inset padding when inset is true", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel inset data-testid="label-inset">
            Inset Label
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    const label = await screen.findByTestId("label-inset");
    expect(label.className).toContain("pl-8");
  });

  it("does not apply inset padding when inset is false", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel data-testid="label-normal">
            Normal Label
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    const label = await screen.findByTestId("label-normal");
    expect(label.className).not.toContain("pl-8");
  });

  it("forwards ref correctly", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel ref={ref}>Ref Label</DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.textContent).toBe("Ref Label");
  });

  it("merges custom className", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel
            className="custom-class"
            data-testid="label-custom"
          >
            Custom Label
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    const label = await screen.findByTestId("label-custom");
    expect(label.className).toContain("custom-class");
    expect(label.className).toContain("px-2");
  });
});

describe("DropdownMenuSeparator", () => {
  it("renders as visual divider", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Section 1</DropdownMenuLabel>
          <DropdownMenuSeparator data-testid="separator" />
          <DropdownMenuLabel>Section 2</DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    const separator = await screen.findByTestId("separator");
    expect(separator).toBeInTheDocument();
  });

  it("applies correct styling classes", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSeparator data-testid="separator" />
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    const separator = await screen.findByTestId("separator");
    expect(separator.className).toContain("h-px");
    expect(separator.className).toContain("bg-muted");
  });

  it("merges custom className", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSeparator
            className="custom-separator"
            data-testid="separator"
          />
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    const separator = await screen.findByTestId("separator");
    expect(separator.className).toContain("custom-separator");
    expect(separator.className).toContain("h-px");
  });

  it("forwards ref correctly", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSeparator ref={ref} />
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("DropdownMenuShortcut", () => {
  it("renders keyboard shortcut text", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            Save
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(await screen.findByText("⌘S")).toBeInTheDocument();
  });

  it("applies styling classes", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            Copy
            <DropdownMenuShortcut data-testid="shortcut">
              ⌘C
            </DropdownMenuShortcut>
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    const shortcut = await screen.findByTestId("shortcut");
    expect(shortcut.className).toContain("ml-auto");
    expect(shortcut.className).toContain("text-xs");
    expect(shortcut.className).toContain("tracking-widest");
    expect(shortcut.className).toContain("opacity-60");
  });

  it("merges custom className", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            Paste
            <DropdownMenuShortcut
              className="custom-shortcut"
              data-testid="shortcut"
            >
              ⌘V
            </DropdownMenuShortcut>
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    const shortcut = await screen.findByTestId("shortcut");
    expect(shortcut.className).toContain("custom-shortcut");
    expect(shortcut.className).toContain("ml-auto");
  });

  it("renders as span element", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            Undo
            <DropdownMenuShortcut data-testid="shortcut">
              ⌘Z
            </DropdownMenuShortcut>
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    const shortcut = await screen.findByTestId("shortcut");
    expect(shortcut.tagName).toBe("SPAN");
  });
});

describe("DropdownMenuCheckboxItem", () => {
  it("renders children content", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem>Show Toolbar</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(await screen.findByText("Show Toolbar")).toBeInTheDocument();
  });

  it("shows check indicator when checked", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked data-testid="checkbox-checked">
            Checked Item
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    const checkbox = await screen.findByTestId("checkbox-checked");
    const checkIcon = screen.getByTestId("check-icon");

    expect(checkbox).toBeInTheDocument();
    expect(checkIcon).toBeInTheDocument();
  });

  it("does not show indicator when unchecked", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked={false} data-testid="checkbox-unchecked">
            Unchecked Item
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(await screen.findByTestId("checkbox-unchecked")).toBeInTheDocument();
    expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument();
  });

  it("forwards ref correctly", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem ref={ref} checked>
            Ref Checkbox
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.textContent).toContain("Ref Checkbox");
  });

  it("merges custom className", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem
            className="custom-checkbox"
            data-testid="checkbox-custom"
            checked
          >
            Custom Checkbox
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    const checkbox = await screen.findByTestId("checkbox-custom");
    expect(checkbox.className).toContain("custom-checkbox");
    expect(checkbox.className).toContain("pl-8");
  });

  it("applies correct structural classes", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem data-testid="checkbox" checked>
            Checkbox Item
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    const checkbox = await screen.findByTestId("checkbox");
    expect(checkbox.className).toContain("pl-8");
    expect(checkbox.className).toContain("relative");
  });
});

describe("DropdownMenuRadioItem", () => {
  it("renders children content", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="option1">
            <DropdownMenuRadioItem value="option1">
              Option 1
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(await screen.findByText("Option 1")).toBeInTheDocument();
  });

  it("shows circle indicator when selected", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="selected">
            <DropdownMenuRadioItem value="selected" data-testid="radio-selected">
              Selected Option
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    const radio = await screen.findByTestId("radio-selected");
    const circleIcon = screen.getByTestId("circle-icon");

    expect(radio).toBeInTheDocument();
    expect(circleIcon).toBeInTheDocument();
  });

  it("does not show indicator when not selected", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="other">
            <DropdownMenuRadioItem value="notSelected" data-testid="radio-unselected">
              Unselected Option
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(await screen.findByTestId("radio-unselected")).toBeInTheDocument();
    expect(screen.queryByTestId("circle-icon")).not.toBeInTheDocument();
  });

  it("works within RadioGroup", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="option2">
            <DropdownMenuRadioItem value="option1">
              Option 1
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="option2">
              Option 2
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="option3">
              Option 3
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(await screen.findByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("forwards ref correctly", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="ref-option">
            <DropdownMenuRadioItem ref={ref} value="ref-option">
              Ref Radio
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.textContent).toContain("Ref Radio");
  });

  it("merges custom className", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="custom">
            <DropdownMenuRadioItem
              className="custom-radio"
              data-testid="radio-custom"
              value="custom"
            >
              Custom Radio
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    const radio = await screen.findByTestId("radio-custom");
    expect(radio.className).toContain("custom-radio");
    expect(radio.className).toContain("pl-8");
  });

  it("applies correct structural classes", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="test">
            <DropdownMenuRadioItem data-testid="radio" value="test">
              Radio Item
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    const radio = await screen.findByTestId("radio");
    expect(radio.className).toContain("pl-8");
    expect(radio.className).toContain("relative");
  });
});

describe("DropdownMenuSubTrigger", () => {
  it("renders children content", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(await screen.findByText("More Options")).toBeInTheDocument();
  });

  it("renders chevron icon", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Submenu</DropdownMenuSubTrigger>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    await screen.findByText("Submenu");
    expect(screen.getByTestId("chevron-right-icon")).toBeInTheDocument();
  });

  it("applies inset padding when inset is true", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger inset data-testid="subtrigger-inset">
              Inset Submenu
            </DropdownMenuSubTrigger>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    const trigger = await screen.findByTestId("subtrigger-inset");
    expect(trigger.className).toContain("pl-8");
  });

  it("does not apply inset padding when inset is false", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger data-testid="subtrigger-normal">
              Normal Submenu
            </DropdownMenuSubTrigger>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    const trigger = await screen.findByTestId("subtrigger-normal");
    expect(trigger.className).not.toContain("pl-8");
  });

  it("forwards ref correctly", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger ref={ref}>
              Ref Submenu
            </DropdownMenuSubTrigger>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.textContent).toContain("Ref Submenu");
  });

  it("merges custom className", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger
              className="custom-subtrigger"
              data-testid="subtrigger-custom"
            >
              Custom Submenu
            </DropdownMenuSubTrigger>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    const trigger = await screen.findByTestId("subtrigger-custom");
    expect(trigger.className).toContain("custom-subtrigger");
    expect(trigger.className).toContain("flex");
  });

  it("applies correct structural classes", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger data-testid="subtrigger">
              Submenu
            </DropdownMenuSubTrigger>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    const trigger = await screen.findByTestId("subtrigger");
    expect(trigger.className).toContain("flex");
    expect(trigger.className).toContain("items-center");
    expect(trigger.className).toContain("gap-2");
  });
});

describe("DropdownMenuSubContent", () => {
  it("renders content", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Submenu</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuLabel>Submenu Content</DropdownMenuLabel>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    await user.hover(await screen.findByText("Submenu"));
    expect(await screen.findByText("Submenu Content")).toBeInTheDocument();
  });

  it("merges custom className", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Submenu</DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              className="custom-subcontent"
              data-testid="subcontent-custom"
            >
              <DropdownMenuLabel>Content</DropdownMenuLabel>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    await user.hover(await screen.findByText("Submenu"));
    const subcontent = await screen.findByTestId("subcontent-custom");
    expect(subcontent.className).toContain("custom-subcontent");
    expect(subcontent.className).toContain("min-w-[8rem]");
  });

  it("forwards ref correctly", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Submenu</DropdownMenuSubTrigger>
            <DropdownMenuSubContent ref={ref}>
              <DropdownMenuLabel>Ref Content</DropdownMenuLabel>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    await user.hover(await screen.findByText("Submenu"));
    await screen.findByText("Ref Content");
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies correct structural classes", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Submenu</DropdownMenuSubTrigger>
            <DropdownMenuSubContent data-testid="subcontent">
              <DropdownMenuLabel>Content</DropdownMenuLabel>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByText("Open"));
    await user.hover(await screen.findByText("Submenu"));
    const subcontent = await screen.findByTestId("subcontent");
    expect(subcontent.className).toContain("min-w-[8rem]");
    expect(subcontent.className).toContain("rounded-md");
    expect(subcontent.className).toContain("border");
  });
});
