import { inherits } from "util";
import Assessor from "./assessor.js";

import IntroductionKeyword from "./assessments/seo/introductionKeywordAssessment.js";
import KeyphraseLength from "./assessments/seo/keyphraseLengthAssessment.js";
import KeywordDensity from "./assessments/seo/keywordDensityAssessment.js";
import MetaDescriptionKeyword from "./assessments/seo/metaDescriptionKeywordAssessment.js";
import TextImages from "./assessments/seo/textImagesAssessment.js";
import TextCompetingLinks from "./assessments/seo/textCompetingLinksAssessment.js";

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
const secondaryKeywordAssessor = function( i18n, options ) {
	Assessor.call( this, i18n, options );

	this._assessments = [
		new IntroductionKeyword(),
		new KeyphraseLength(),
		new KeywordDensity(),
		new MetaDescriptionKeyword(),
		new TextCompetingLinks(),
		new TextImages(),
	];
};

inherits( secondaryKeywordAssessor, Assessor );

export default secondaryKeywordAssessor;
