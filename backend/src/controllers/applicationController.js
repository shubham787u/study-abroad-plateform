import Application from "../models/Application.js";
import Program from "../models/Program.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";
import { cacheDel } from "../config/redis.js";

// @desc    Apply to a program
// @route   POST /api/applications
// @access  Private (Student)
export const applyToProgram = async (req, res) => {
  try {
    const { programId, statementOfPurpose } = req.body;

    if (!programId) {
      return sendError(res, 400, "Program ID is required");
    }

    // Check if program exists
    const program = await Program.findById(programId).populate("university");
    if (!program) {
      return sendError(res, 404, "Program not found");
    }

    // Check if student has already applied to this program
    const existingApplication = await Application.findOne({
      student: req.user._id,
      program: programId,
    });

    if (existingApplication) {
      return sendError(
        res,
        400,
        "You have already applied to this program. Duplicate applications are not allowed."
      );
    }

    // Create application with status history
    const initialStatus = "Applied";
    const application = await Application.create({
      student: req.user._id,
      program: programId,
      university: program.university._id,
      status: initialStatus,
      statementOfPurpose: statementOfPurpose || "",
      statusHistory: [
        {
          status: initialStatus,
          updatedBy: req.user._id,
          note: "Application submitted successfully by student",
          updatedAt: new Date(),
        },
      ],
    });

    // Populate references for clean response
    const populatedApplication = await Application.findById(application._id)
      .populate("student", "name email")
      .populate({
        path: "program",
        select: "title field degreeLevel fee intake durationYears",
      })
      .populate("university", "name country location");

    // Invalidate user cache
    await cacheDel(`cache:/api/applications*:${req.user._id}`);

    return sendSuccess(
      res,
      201,
      "Application submitted successfully",
      { application: populatedApplication }
    );
  } catch (error) {
    if (error.code === 11000) {
      return sendError(
        res,
        400,
        "You have already applied to this program. Duplicate applications are not allowed."
      );
    }
    return sendError(res, 500, error.message);
  }
};

// @desc    Get applications of logged in student
// @route   GET /api/applications
// @access  Private
export const getMyApplications = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === "student") {
      filter.student = req.user._id;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const applications = await Application.find(filter)
      .populate("student", "name email")
      .populate({
        path: "program",
        select: "title field degreeLevel fee intake durationYears",
      })
      .populate("university", "name country location ranking website")
      .sort({ createdAt: -1 });

    return sendSuccess(
      res,
      200,
      "Applications retrieved successfully",
      applications,
      { count: applications.length }
    );
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Get single application by ID
// @route   GET /api/applications/:id
// @access  Private
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("student", "name email preferredCountry preferredField budget ieltsScore")
      .populate("program")
      .populate("university")
      .populate("statusHistory.updatedBy", "name email role");

    if (!application) {
      return sendError(res, 404, "Application not found");
    }

    // Check authorization: must be applicant or counselor/admin
    if (
      req.user.role === "student" &&
      application.student._id.toString() !== req.user._id.toString()
    ) {
      return sendError(res, 403, "Not authorized to view this application");
    }

    return sendSuccess(res, 200, "Application details retrieved", { application });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Update application status (Admin / Counselor / Workflow transition)
// @route   PATCH /api/applications/:id/status
// @access  Private (Counselor / Admin / Authorized user)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const allowedStatuses = ["Applied", "Reviewed", "Accepted", "Rejected"];
    if (!status || !allowedStatuses.includes(status)) {
      return sendError(
        res,
        400,
        `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`
      );
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return sendError(res, 404, "Application not found");
    }

    // Update status and push to status history
    application.status = status;
    application.statusHistory.push({
      status,
      updatedBy: req.user._id,
      note: note || `Status updated to ${status}`,
      updatedAt: new Date(),
    });

    await application.save();

    const updatedApplication = await Application.findById(application._id)
      .populate("student", "name email")
      .populate("program", "title field fee")
      .populate("university", "name country");

    return sendSuccess(
      res,
      200,
      `Application status updated to ${status}`,
      { application: updatedApplication }
    );
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
