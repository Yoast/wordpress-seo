import TreeAssessor from "./TreeAssessor";
import * as ScoreAggregators from "../../scoring/scoreAggregators";
import * as Assessments from "./assessments";
import * as assessorFactories from "./assessorFactories";
import { cornerstoneAssessmentListFactories } from "./cornerstone";

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
