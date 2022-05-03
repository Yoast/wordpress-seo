import { inherits } from "util";

import Assessor from "./assessor.js";
import IntroductionKeyword from "./assessments/seo/IntroductionKeywordAssessment.js";
import KeyphraseLength from "./assessments/seo/KeyphraseLengthAssessment.js";
import KeywordDensity from "./assessments/seo/KeywordDensityAssessment.js";
import MetaDescriptionKeyword from "./assessments/seo/MetaDescriptionKeywordAssessment.js";
import ImageKeyphrase from "./assessments/seo/KeyphraseInImageTextAssessment";
import TextCompetingLinks from "./assessments/seo/TextCompetingLinksAssessment.js";
import FunctionWordsInKeyphrase from "./assessments/seo/FunctionWordsInKeyphraseAssessment";

/**
 * Creates the Assessor
 *
 * @param {object}  researcher      The researcher to use for the analysis.
 * @param {Object}  options         The options for this assessor.
 * @param {Object}  options.marker  The marker to pass the list of marks to.
 *
 * @constructor
 */
const relatedKeywordAssessor = function( researcher, options ) {
	Assessor.call( this, researcher, options );
	this.type = "relatedKeywordAssessor";

	this._assessments = [
		new IntroductionKeyword(),
		new KeyphraseLength( { isRelatedKeyphrase: true } ),
		new KeywordDensity(),
		new MetaDescriptionKeyword(),
		new TextCompetingLinks(),
		new FunctionWordsInKeyphrase(),
		new ImageKeyphrase(),
	];
};

inherits( relatedKeywordAssessor, Assessor );

export default relatedKeywordAssessor;
