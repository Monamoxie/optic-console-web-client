import { render, screen, waitFor } from "@testing-library/react";
import { EmailVerificationForm } from "./EmailVerificationForm";

jest.mock("@/lib/api", () => {
  const actual = jest.requireActual("@/lib/api");
  return {
    ...actual,
    authApi: {
      ...actual.authApi,
      verifyEmailToken: jest.fn(),
    },
  };
});

jest.mock("@/lib/auth", () => {
  const actual = jest.requireActual("@/lib/auth");
  return {
    ...actual,
  };
});

const mockVerifyEmailToken = (
  require("@/lib/api") as typeof import("@/lib/api")
).authApi.verifyEmailToken as jest.Mock;

describe("EmailVerificationForm", () => {
  beforeEach(() => {
    mockVerifyEmailToken.mockReset();
  });

  it("shows invalid link message when token is missing", () => {
    render(<EmailVerificationForm token={null} />);

    expect(screen.getByText(/invalid link/i)).toBeInTheDocument();
  });

  it("shows success message when token is valid", async () => {
    mockVerifyEmailToken.mockResolvedValueOnce(undefined);

    render(<EmailVerificationForm token="valid-token" />);

    expect(screen.getByText(/verifying email/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(/email verified successfully/i)
      ).toBeInTheDocument();
    });
  });
});

