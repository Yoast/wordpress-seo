import { inherits } from "util";

import IntroductionKeywordAssessment from "./languages/legacy/assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "./languages/legacy/assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "./languages/legacy/assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "./languages/legacy/assessments/seo/MetaDescriptionKeywordAssessment";
import Assessor from "./assessor";
import FunctionWordsInKeyphrase from "./languages/legacy/assessments/seo/FunctionWordsInKeyphraseAssessment";

/**
 * Creates the Assessor used for taxonomy pages.
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @constructor
 */
const RelatedKeywordTaxonomyAssessor = function( i18n, options ) {
	Assessor.call( this, i18n, options );
	this.type = "RelatedKeywordsTaxonomyAssessor";

	this._assessments = [
		new IntroductionKeywordAssessment(),
		new KeyphraseLengthAssessment( { isRelatedKeyphrase: true } ),
		new KeywordDensityAssessment(),
		new MetaDescriptionKeywordAssessment(),
		// Text Images assessment here.
		new FunctionWordsInKeyphrase(),
	];
};

inherits( RelatedKeywordTaxonomyAssessor, Assessor );

export default RelatedKeywordTaxonomyAssessor;
