const z = require("zod");

const registerSchema = z.object({
    email: z.string().trim().email().max(254),
    name: z.string().trim().min(1).max(100),
    username: z.string().trim().min(3).max(30),
    password: z.string().min(8).max(128),
});

const loginSchema = z.object({
    email: z.string().trim().email().max(254),
    password: z.string().min(1).max(128),
});

module.exports = { registerSchema, loginSchema };
