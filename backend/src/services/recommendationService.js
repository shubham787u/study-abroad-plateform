import Program from "../models/Program.js";

export const getProgramRecommendations = async (preferences) => {
  const {
    preferredCountry = "",
    preferredField = "",
    budget = 0,
    ieltsScore = 0,
    preferredIntake = "",
  } = preferences;

  const countryRegex = preferredCountry ? new RegExp(preferredCountry.trim(), "i") : null;
  const fieldRegex = preferredField ? new RegExp(preferredField.trim(), "i") : null;
  const intakeRegex = preferredIntake ? new RegExp(preferredIntake.trim(), "i") : null;
  const maxBudget = budget ? Number(budget) : Number.MAX_SAFE_INTEGER;
  const userIelts = ieltsScore ? Number(ieltsScore) : 9.0;

  const pipeline = [
    // 1. Join with University collection
    {
      $lookup: {
        from: "universities",
        localField: "university",
        foreignField: "_id",
        as: "university",
      },
    },
    {
      $unwind: "$university",
    },

    // 2. Initial Match Filter
    {
      $match: {
        ...(userIelts ? { minIeltsScore: { $lte: userIelts } } : {}),
      },
    },

    // 3. Compute weighted match scores
    {
      $addFields: {
        countryScore: {
          $cond: [
            countryRegex
              ? { $regexMatch: { input: "$university.country", regex: countryRegex } }
              : false,
            40,
            0,
          ],
        },
        fieldScore: {
          $cond: [
            fieldRegex
              ? { $regexMatch: { input: "$field", regex: fieldRegex } }
              : false,
            30,
            0,
          ],
        },
        budgetScore: {
          $cond: [{ $lte: ["$fee", maxBudget] }, 20, 0],
        },
        intakeScore: {
          $cond: [
            intakeRegex
              ? { $regexMatch: { input: "$intake", regex: intakeRegex } }
              : false,
            10,
            0,
          ],
        },
      },
    },
    {
      $addFields: {
        matchScore: {
          $add: ["$countryScore", "$fieldScore", "$budgetScore", "$intakeScore"],
        },
      },
    },
    {
      $addFields: {
        matchBadge: {
          $cond: [
            { $gte: ["$matchScore", 80] },
            "Excellent Match",
            {
              $cond: [
                { $gte: ["$matchScore", 50] },
                "Good Match",
                "Moderate Match",
              ],
            },
          ],
        },
      },
    },

    // 4. Sort by Match Score descending, Fee ascending
    {
      $sort: {
        matchScore: -1,
        fee: 1,
        "university.ranking": 1,
      },
    },

    // 5. Project optimized output
    {
      $project: {
        countryScore: 0,
        fieldScore: 0,
        budgetScore: 0,
        intakeScore: 0,
        "university.__v": 0,
        "university.createdAt": 0,
        "university.updatedAt": 0,
        __v: 0,
      },
    },
  ];

  const recommendations = await Program.aggregate(pipeline);
  return recommendations;
};
