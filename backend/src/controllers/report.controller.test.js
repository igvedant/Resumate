jest.mock("../models/report.model", () => ({
    findOne: jest.fn(),
}));

jest.mock("../services/ai.service", () => ({
    generateReport: jest.fn(),
    updateResume: jest.fn(),
}));

const mongoose = require("mongoose");
const reportModel = require("../models/report.model");
const { fetchReportById } = require("./report.controller");

describe("report authorization", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("loads a report only for the authenticated user", async () => {
        const report = { _id: "507f1f77bcf86cd799439011" };
        reportModel.findOne.mockResolvedValue(report);
        const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await fetchReportById({
            params: { id: report._id },
            user: { _id: "507f1f77bcf86cd799439012" },
        }, response);

        expect(reportModel.findOne).toHaveBeenCalledWith({
            _id: report._id,
            user: "507f1f77bcf86cd799439012",
        });
        expect(response.status).toHaveBeenCalledWith(200);
    });

    test("rejects malformed report IDs before querying MongoDB", async () => {
        const response = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await fetchReportById({
            params: { id: "not-an-object-id" },
            user: { _id: new mongoose.Types.ObjectId() },
        }, response);

        expect(response.status).toHaveBeenCalledWith(400);
        expect(reportModel.findOne).not.toHaveBeenCalled();
    });
});
