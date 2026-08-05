import User from "../models/User.js";
import { getProgramRecommendations } from "../services/recommendationService.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";

// @desc    Get recommendations based on logged in user's profile
// @route   GET /api/recommendations
// @access  Private
export const getUserProfileRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return sendError(res, 404, "User profile not found");
    }

    const preferences = {
      preferredCountry: user.preferredCountry || req.query.country || "",
      preferredField: user.preferredField || req.query.field || "",
      budget: user.budget || req.query.budget || 0,
      ieltsScore: user.ieltsScore || req.query.ielts || 0,
      preferredIntake: user.preferredIntake || req.query.intake || "",
    };

    const recommendations = await getProgramRecommendations(preferences);

    return sendSuccess(
      res,
      200,
      "Program recommendations generated successfully",
      recommendations,
      {
        totalRecommendations: recommendations.length,
        appliedPreferences: preferences,
      }
    );
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Get custom recommendations for query/body payload
// @route   POST /api/recommendations/custom
// @access  Public
export const getCustomRecommendations = async (req, res) => {
  try {
    const {
      country,
      field,
      budget,
      ieltsScore,
      intake,
    } = req.body;

    const preferences = {
      preferredCountry: country || req.query.country || "",
      preferredField: field || req.query.field || "",
      budget: budget || req.query.budget || 0,
      ieltsScore: ieltsScore || req.query.ielts || 0,
      preferredIntake: intake || req.query.intake || "",
    };

    const recommendations = await getProgramRecommendations(preferences);

    return sendSuccess(
      res,
      200,
      "Custom program recommendations generated successfully",
      recommendations,
      {
        totalRecommendations: recommendations.length,
        appliedPreferences: preferences,
      }
    );
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
