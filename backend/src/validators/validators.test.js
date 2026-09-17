const { registerSchema, loginSchema } = require("./auth.validator");
const { reportInputSchema } = require("./report.validator");

describe("request validators", () => {
    test("accepts valid registration data", () => {
        const result = registerSchema.safeParse({
            email: "candidate@example.com",
            name: "Candidate",
            username: "candidate",
            password: "strong-password",
        });

        expect(result.success).toBe(true);
    });

    test("rejects weak registration passwords", () => {
        const result = registerSchema.safeParse({
            email: "candidate@example.com",
            name: "Candidate",
            username: "candidate",
            password: "short",
        });

        expect(result.success).toBe(false);
    });

    test("rejects empty report descriptions", () => {
        const result = reportInputSchema.safeParse({
            selfDescription: "",
            jobDescription: "Backend developer",
        });

        expect(result.success).toBe(false);
    });

    test("accepts login credentials", () => {
        expect(loginSchema.safeParse({
            email: "candidate@example.com",
            password: "password",
        }).success).toBe(true);
    });
});
