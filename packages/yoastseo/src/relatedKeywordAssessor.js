import { inherits } from "util";

import Assessor from "./assessor.js";
import IntroductionKeyword from "./scoring/assessments/seo/IntroductionKeywordAssessment.js";
import KeyphraseLength from "./scoring/assessments/seo/KeyphraseLengthAssessment.js";
import KeywordDensity from "./scoring/assessments/seo/KeywordDensityAssessment.js";
import MetaDescriptionKeyword from "./scoring/assessments/seo/MetaDescriptionKeywordAssessment.js";
import TextImages from "./scoring/assessments/seo/TextImagesAssessment.js";
import TextCompetingLinks from "./scoring/assessments/seo/TextCompetingLinksAssessment.js";
import FunctionWordsInKeyphrase from "./scoring/assessments/seo/FunctionWordsInKeyphraseAssessment";

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
const relatedKeywordAssessor = function( i18n, options ) {
	Assessor.call( this, i18n, options );

	this._assessments = [
		new IntroductionKeyword(),
		new KeyphraseLength( { isRelatedKeyphrase: true } ),
		new KeywordDensity(),
		new MetaDescriptionKeyword(),
		new TextCompetingLinks(),
		new TextImages(),
		new FunctionWordsInKeyphrase(),
	];
};

inherits( relatedKeywordAssessor, Assessor );

export default relatedKeywordAssessor;
