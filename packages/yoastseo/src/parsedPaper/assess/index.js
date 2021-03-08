import TreeAssessor from "./TreeAssessor";
import * as ScoreAggregators from "./scoreAggregators";
import * as Assessments from "./assessments";
import * as assessorFactories from "./assessorFactories";
import { cornerstoneAssessorFactories } from "./cornerstone";
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
	cornerstoneAssessorFactories,
	cornerstoneAssessmentListFactories,
};
