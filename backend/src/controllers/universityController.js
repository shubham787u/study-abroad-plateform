import University from "../models/University.js";
import Program from "../models/Program.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";
import { getPaginationOptions, formatPaginatedResponse } from "../utils/pagination.js";

// @desc    Get paginated programs with filtering & sorting
// @route   GET /api/programs
// @access  Public
export const getPrograms = async (req, res) => {
  try {
    const {
      country,
      field,
      intake,
      maxFee,
      minIelts,
      search,
      sortBy = "fee",
      order = "asc",
    } = req.query;

    const { page, limit, skip } = getPaginationOptions(req.query);

    // Build filter object for Program query
    const programQuery = {};

    if (field) {
      programQuery.field = { $regex: field.trim(), $options: "i" };
    }

    if (intake) {
      programQuery.intake = { $regex: intake.trim(), $options: "i" };
    }

    if (maxFee) {
      programQuery.fee = { $lte: Number(maxFee) };
    }

    if (minIelts) {
      programQuery.minIeltsScore = { $lte: Number(minIelts) };
    }

    // If country or search filter is provided, find matching universities first
    let universityFilter = {};
    if (country) {
      universityFilter.country = { $regex: country.trim(), $options: "i" };
    }
    if (search) {
      universityFilter.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { country: { $regex: search.trim(), $options: "i" } },
      ];
    }

    if (country || search) {
      const matchingUniversities = await University.find(universityFilter).select("_id");
      const universityIds = matchingUniversities.map((u) => u._id);
      
      if (search) {
        programQuery.$or = [
          { university: { $in: universityIds } },
          { title: { $regex: search.trim(), $options: "i" } },
        ];
      } else {
        programQuery.university = { $in: universityIds };
      }
    }

    // Determine sort options
    const sortOrder = order === "desc" ? -1 : 1;
    let sortConfig = {};
    if (sortBy === "fee") {
      sortConfig.fee = sortOrder;
    } else if (sortBy === "title") {
      sortConfig.title = sortOrder;
    } else {
      sortConfig.createdAt = sortOrder;
    }

    // Execute paginated program query with field projection & population
    const totalDocs = await Program.countDocuments(programQuery);
    const programs = await Program.find(programQuery)
      .select("title university field degreeLevel intake fee currency durationYears minIeltsScore description")
      .populate("university", "name country location ranking website logoUrl")
      .sort(sortConfig)
      .skip(skip)
      .limit(limit)
      .lean();

    const paginatedResult = formatPaginatedResponse(programs, totalDocs, page, limit);

    return sendSuccess(
      res,
      200,
      "Programs retrieved successfully",
      paginatedResult.docs,
      paginatedResult.meta
    );
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Get single program details
// @route   GET /api/programs/:id
// @access  Public
export const getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id)
      .populate("university", "name country location ranking website description logoUrl");

    if (!program) {
      return sendError(res, 404, "Program not found");
    }

    return sendSuccess(res, 200, "Program details retrieved", { program });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Get paginated universities
// @route   GET /api/universities
// @access  Public
export const getUniversities = async (req, res) => {
  try {
    const { country, search, sortBy = "ranking", order = "asc" } = req.query;
    const { page, limit, skip } = getPaginationOptions(req.query);

    const query = {};
    if (country) {
      query.country = { $regex: country.trim(), $options: "i" };
    }
    if (search) {
      query.name = { $regex: search.trim(), $options: "i" };
    }

    const sortOrder = order === "desc" ? -1 : 1;
    const sortConfig = {};
    if (sortBy === "name") {
      sortConfig.name = sortOrder;
    } else {
      sortConfig.ranking = sortOrder;
    }

    const totalDocs = await University.countDocuments(query);
    const universities = await University.find(query)
      .select("name country location ranking website description logoUrl")
      .sort(sortConfig)
      .skip(skip)
      .limit(limit)
      .lean();

    const paginatedResult = formatPaginatedResponse(universities, totalDocs, page, limit);

    return sendSuccess(
      res,
      200,
      "Universities retrieved successfully",
      paginatedResult.docs,
      paginatedResult.meta
    );
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
