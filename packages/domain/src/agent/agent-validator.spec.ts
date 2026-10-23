import { agentInputSchema, inviteAgentSchema } from "./agent-validator.ts";

describe("agentInputSchema", () => {
  it("should trim the agent names", () => {
    expect(
      agentInputSchema.parse({ firstName: " Camille ", lastName: " Martin " }),
    ).toEqual({
      firstName: "Camille",
      lastName: "Martin",
    });
  });

  it("should reject a first name over 100 characters", () => {
    expect(
      agentInputSchema.safeParse({
        firstName: "a".repeat(101),
        lastName: "Martin",
      }).success,
    ).toBe(false);
  });
});

describe("inviteAgentSchema", () => {
  it("should invite as an agent by default", () => {
    expect(
      inviteAgentSchema.parse({
        email: "camille@example.com",
        firstName: "Camille",
        lastName: "Martin",
      }),
    ).toEqual({
      email: "camille@example.com",
      firstName: "Camille",
      lastName: "Martin",
      role: "agent",
    });
  });

  it("should reject an invalid email", () => {
    expect(
      inviteAgentSchema.safeParse({
        email: "camille",
        firstName: "Camille",
        lastName: "Martin",
      }).success,
    ).toBe(false);
  });
});
