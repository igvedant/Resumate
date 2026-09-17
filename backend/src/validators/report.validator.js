const z = require("zod");

const reportInputSchema = z.object({
    selfDescription: z.string().trim().min(1).max(15000),
    jobDescription: z.string().trim().min(1).max(15000),
});

module.exports = { reportInputSchema };
