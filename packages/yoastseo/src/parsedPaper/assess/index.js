import TreeAssessor from "./TreeAssessor.js";
import * as ScoreAggregators from "../../scoring/scoreAggregators/index.js";
import * as Assessments from "./assessments/index.js";
import * as assessorFactories from "./assessorFactories.js";
import { cornerstoneAssessmentListFactories } from "./cornerstone/index.js";

/**
 * Contains the logic to assess a tree representation of a text.
 *
 * @module tree/assess
 *
 * @see module:parsedPaper/structure
 */
export {
	TreeAssessor,
	ScoreAggregators,
	Assessments,
	assessorFactories,
	cornerstoneAssessmentListFactories,
};
