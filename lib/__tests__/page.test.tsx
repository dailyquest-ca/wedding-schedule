import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import WeddingPage from "@/components/WeddingPage";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn((url: string) => {
    if (url === "/api/public/content") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ events: [], notes: { en: [], ja: [] } }),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    });
  }));
});

afterEach(() => {
  vi.restoreAllMocks();
});

async function renderPage() {
  await act(async () => {
    render(<WeddingPage />);
  });
}

describe("WeddingPage", () => {
  it("renders the wedding title", async () => {
    await renderPage();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /A\s*&\s*Z\s*Wedding/i
    );
  });

  it("renders a language toggle button", async () => {
    await renderPage();
    const toggle = screen.getByRole("button", {
      name: /switch to/i,
    });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveTextContent("日本語");
  });

  it("switches to Japanese when the toggle is clicked", async () => {
    await renderPage();
    const toggle = screen.getByRole("button", { name: /switch to/i });
    fireEvent.click(toggle);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /ウェディング/
    );
  });

  it("switches back to English when toggled again", async () => {
    await renderPage();
    fireEvent.click(screen.getByRole("button", { name: /switch to/i }));
    fireEvent.click(screen.getByRole("button", { name: /switch to/i }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /A\s*&\s*Z\s*Wedding/i
    );
  });

  it("renders all 9 day sections (Apr 5-13)", async () => {
    await renderPage();
    const dayHeadings = screen.getAllByRole("heading", { level: 2 });
    expect(dayHeadings.length).toBeGreaterThanOrEqual(9);
  });

  it("renders the WhatsApp link in the footer", async () => {
    await renderPage();
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

  it("renders notes section heading", async () => {
    await renderPage();
    const heading = screen.getByRole("heading", { name: /notes/i });
    expect(heading).toBeInTheDocument();
  });

  it("renders the real April wedding date", async () => {
    await renderPage();
    expect(screen.getByText(/Apr 9/i)).toBeInTheDocument();
  });

  it("renders Apr 13 as the last visible day", async () => {
    await renderPage();
    expect(screen.getByText(/Apr 13/i)).toBeInTheDocument();
  });

  it("renders arrival summaries with first names only", async () => {
    await renderPage();
    expect(screen.getAllByText(/Anna, Zak, Ishan/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Kawamura|Verma/i)).not.toBeInTheDocument();
  });

  it("uses semantic landmarks", async () => {
    const { container } = render(<WeddingPage />);
    await act(async () => {});
    expect(container.querySelector("main")).toBeInTheDocument();
    expect(container.querySelector("header")).toBeInTheDocument();
    expect(container.querySelector("footer")).toBeInTheDocument();
  });

  it("renders Sign up buttons for signuppable slots", async () => {
    await renderPage();
    const signupButtons = screen.getAllByRole("button", { name: /sign up for/i });
    expect(signupButtons.length).toBe(8);
  });

  it("opens the signup modal when a Sign up button is clicked", async () => {
    await renderPage();
    const signupButtons = screen.getAllByRole("button", { name: /sign up for/i });
    fireEvent.click(signupButtons[0]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes the modal when close button is clicked", async () => {
    await renderPage();
    const signupButtons = screen.getAllByRole("button", { name: /sign up for/i });
    fireEvent.click(signupButtons[0]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
