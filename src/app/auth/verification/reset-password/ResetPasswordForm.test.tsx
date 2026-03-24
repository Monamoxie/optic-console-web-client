import { render, screen, waitFor } from "@testing-library/react";
import { ResetPasswordForm } from "./ResetPasswordForm";

jest.mock("@/lib/api", () => {
  const actual = jest.requireActual("@/lib/api");
  return {
    ...actual,
    authApi: {
      ...actual.authApi,
      verifyResetPasswordToken: jest.fn(),
    },
  };
});

jest.mock("@/lib/auth", () => {
  const actual = jest.requireActual("@/lib/auth");
  return {
    ...actual,
    useAuth: () => ({
      resetPassword: jest.fn(),
    }),
  };
});

const mockVerifyResetPasswordToken = (
  require("@/lib/api") as typeof import("@/lib/api")
).authApi.verifyResetPasswordToken as jest.Mock;

describe("ResetPasswordForm", () => {
  beforeEach(() => {
    mockVerifyResetPasswordToken.mockReset();
  });

  it("shows invalid link message when token is missing", () => {
    render(<ResetPasswordForm token={null} />);

    expect(
      screen.getByText(/invalid link/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/missing or invalid/i)
    ).toBeInTheDocument();
  });

  it("shows form when token is valid", async () => {
    mockVerifyResetPasswordToken.mockResolvedValueOnce(undefined);

    render(<ResetPasswordForm token="valid-token" />);

    expect(
      screen.getByText(/verifying link/i)
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(/set new password/i)
      ).toBeInTheDocument();
    });
  });
});

