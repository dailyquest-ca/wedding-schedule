import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import WeddingPage from "@/components/WeddingPage";

describe("WeddingPage", () => {
  it("renders the wedding title", () => {
    render(<WeddingPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /A\s*&\s*Z\s*Wedding/i
    );
  });

  it("renders a language toggle button", () => {
    render(<WeddingPage />);
    const toggle = screen.getByRole("button", {
      name: /switch to/i,
    });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveTextContent("日本語");
  });

  it("switches to Japanese when the toggle is clicked", () => {
    render(<WeddingPage />);
    const toggle = screen.getByRole("button", { name: /switch to/i });
    fireEvent.click(toggle);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /ウェディング/
    );
  });

  it("switches back to English when toggled again", () => {
    render(<WeddingPage />);
    fireEvent.click(screen.getByRole("button", { name: /switch to/i }));
    fireEvent.click(screen.getByRole("button", { name: /switch to/i }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /A\s*&\s*Z\s*Wedding/i
    );
  });

  it("renders all 9 day sections (Apr 5-13)", () => {
    render(<WeddingPage />);
    const dayHeadings = screen.getAllByRole("heading", { level: 2 });
    expect(dayHeadings.length).toBeGreaterThanOrEqual(9);
  });

  it("renders the WhatsApp link in the footer", () => {
    render(<WeddingPage />);
    const links = screen.getAllByRole("link");
    const whatsappLink = links.find((l) =>
      l.textContent?.toLowerCase().includes("whatsapp")
    );
    expect(whatsappLink).toBeDefined();
    expect(whatsappLink).toHaveAttribute(
      "href",
      expect.stringMatching(/^https:\/\//)
    );
  });

  it("renders notes section heading", () => {
    render(<WeddingPage />);
    const heading = screen.getByRole("heading", { name: /notes/i });
    expect(heading).toBeInTheDocument();
  });

  it("renders the real April wedding date", () => {
    render(<WeddingPage />);
    expect(screen.getByText(/Apr 9/i)).toBeInTheDocument();
  });

  it("renders Apr 13 as the last visible day", () => {
    render(<WeddingPage />);
    expect(screen.getByText(/Apr 13/i)).toBeInTheDocument();
  });

  it("renders arrival summaries with first names only", () => {
    render(<WeddingPage />);
    expect(screen.getAllByText(/Anna, Zak, Ishan/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Kawamura|Verma/i)).not.toBeInTheDocument();
  });

  it("uses semantic landmarks", () => {
    const { container } = render(<WeddingPage />);
    expect(container.querySelector("main")).toBeInTheDocument();
    expect(container.querySelector("header")).toBeInTheDocument();
    expect(container.querySelector("footer")).toBeInTheDocument();
  });
});
