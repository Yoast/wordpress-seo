import { inherits } from "util";

import IntroductionKeywordAssessment from "./../../assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "./../../assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "./../../assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "./../../assessments/seo/MetaDescriptionKeywordAssessment";
import Assessor from "./../../assessor";
import FunctionWordsInKeyphrase from "./../../assessments/seo/FunctionWordsInKeyphraseAssessment";

/**
 * Creates the Assessor used for collection pages.
 *
 * @param {object}  i18n        The i18n object used for translations.
 * @param {object}  researcher  The researcher to use for the analysis.
 * @param {Object}  options     The options for this assessor.
 *
 * @constructor
 */
const CollectionCornerstoneRelatedKeywordAssessor = function( i18n, researcher, options ) {
	Assessor.call( this, i18n, researcher, options );
	this.type = "CollectionCornerstoneRelatedKeywordAssessor";

	this._assessments = [
		new IntroductionKeywordAssessment(),
		new KeyphraseLengthAssessment( { isRelatedKeyphrase: true } ),
		new KeywordDensityAssessment(),
		new MetaDescriptionKeywordAssessment(
			{ parameters: { recommendedMinimum: 1 },
				scores: { good: 9, bad: 3 },
			}
		),
		new FunctionWordsInKeyphrase(),
	];
};

inherits( CollectionCornerstoneRelatedKeywordAssessor, Assessor );

export default CollectionCornerstoneRelatedKeywordAssessor;
