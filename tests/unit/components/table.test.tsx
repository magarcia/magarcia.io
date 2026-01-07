import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Table, {
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/Table";

describe("Table Components", () => {
  describe("Table", () => {
    it("renders table element with responsive classes", () => {
      const { container } = render(
        <Table data-testid="test-table">
          <tbody>
            <tr>
              <td>Cell</td>
            </tr>
          </tbody>
        </Table>
      );

      const table = container.querySelector("table");
      expect(table).toBeInTheDocument();
      expect(table).toHaveClass("block", "md:table", "table-fixed");
    });

    it("passes through additional props", () => {
      render(
        <Table id="custom-table" className="extra-class">
          <tbody>
            <tr>
              <td>Cell</td>
            </tr>
          </tbody>
        </Table>
      );

      const table = screen.getByRole("table");
      expect(table).toHaveAttribute("id", "custom-table");
      expect(table).toHaveClass("extra-class");
    });
  });

  describe("TableHead", () => {
    it("renders thead element with responsive hidden classes", () => {
      const { container } = render(
        <table>
          <TableHead>
            <tr>
              <th>Header</th>
            </tr>
          </TableHead>
        </table>
      );

      const thead = container.querySelector("thead");
      expect(thead).toBeInTheDocument();
      expect(thead).toHaveClass(
        "sr-only",
        "md:not-sr-only",
        "md:table-header-group",
        "font-medium",
        "border-b"
      );
    });

    it("passes through additional props", () => {
      const { container } = render(
        <table>
          <TableHead data-testid="custom-thead" className="extra-class">
            <tr>
              <th>Header</th>
            </tr>
          </TableHead>
        </table>
      );

      const thead = screen.getByTestId("custom-thead");
      expect(thead).toBeInTheDocument();
      expect(thead).toHaveClass("extra-class");
    });
  });

  describe("TableBody", () => {
    it("renders tbody element", () => {
      const { container } = render(
        <table>
          <TableBody>
            <tr>
              <td>Cell</td>
            </tr>
          </TableBody>
        </table>
      );

      const tbody = container.querySelector("tbody");
      expect(tbody).toBeInTheDocument();
    });

    it("passes through additional props", () => {
      const { container } = render(
        <table>
          <TableBody data-testid="custom-tbody" className="extra-class">
            <tr>
              <td>Cell</td>
            </tr>
          </TableBody>
        </table>
      );

      const tbody = screen.getByTestId("custom-tbody");
      expect(tbody).toBeInTheDocument();
      expect(tbody).toHaveClass("extra-class");
    });
  });

  describe("TableRow", () => {
    it("renders tr element with responsive border styling", () => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow>
              <td>Cell</td>
            </TableRow>
          </tbody>
        </table>
      );

      const tr = container.querySelector("tr");
      expect(tr).toBeInTheDocument();
      expect(tr).toHaveClass(
        "block",
        "md:table-row",
        "border-b",
        "last:border-b-0",
        "mb-4",
        "md:mb-0"
      );
    });

    it("passes through additional props", () => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow data-testid="custom-row" className="extra-class">
              <td>Cell</td>
            </TableRow>
          </tbody>
        </table>
      );

      const tr = screen.getByTestId("custom-row");
      expect(tr).toBeInTheDocument();
      expect(tr).toHaveClass("extra-class");
    });
  });

  describe("TableCell", () => {
    it("renders td element with responsive display classes", () => {
      const { container } = render(
        <table>
          <tbody>
            <tr>
              <TableCell>Content</TableCell>
            </tr>
          </tbody>
        </table>
      );

      const td = container.querySelector("td");
      expect(td).toBeInTheDocument();
      expect(td).toHaveClass(
        "block",
        "md:table-cell",
        "relative",
        "py-3",
        "px-4",
        "md:px-4"
      );
    });

    it("renders cell content", () => {
      render(
        <table>
          <tbody>
            <tr>
              <TableCell>Test Content</TableCell>
            </tr>
          </tbody>
        </table>
      );

      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("passes through additional props", () => {
      const { container } = render(
        <table>
          <tbody>
            <tr>
              <TableCell data-testid="custom-cell" className="extra-class">
                Content
              </TableCell>
            </tr>
          </tbody>
        </table>
      );

      const td = screen.getByTestId("custom-cell");
      expect(td).toBeInTheDocument();
      expect(td).toHaveClass("extra-class");
    });
  });

  describe("Table Components Integration", () => {
    it("renders complete table structure correctly", () => {
      render(
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Header 1</TableCell>
              <TableCell>Header 2</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Row 1 Cell 1</TableCell>
              <TableCell>Row 1 Cell 2</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Row 2 Cell 1</TableCell>
              <TableCell>Row 2 Cell 2</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByText("Header 1")).toBeInTheDocument();
      expect(screen.getByText("Header 2")).toBeInTheDocument();
      expect(screen.getByText("Row 1 Cell 1")).toBeInTheDocument();
      expect(screen.getByText("Row 1 Cell 2")).toBeInTheDocument();
      expect(screen.getByText("Row 2 Cell 1")).toBeInTheDocument();
      expect(screen.getByText("Row 2 Cell 2")).toBeInTheDocument();
    });
  });
});
