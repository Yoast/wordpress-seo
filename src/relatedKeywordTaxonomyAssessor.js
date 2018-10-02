import { inherits } from "util";

import IntroductionKeywordAssessment from "./assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "./assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "./assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "./assessments/seo/MetaDescriptionKeywordAssessment";
import Assessor from "./assessor";

/**
 * Creates the Assessor used for taxonomy pages.
 *
 * @param {object} i18n The i18n object used for translations.
 * @constructor
 */
const RelatedKeywordTaxonomyAssessor = function( i18n ) {
	Assessor.call( this, i18n );
	this.type = "RelatedKeywordsTaxonomyAssessor";

	this._assessments = [
		new IntroductionKeywordAssessment(),
		new KeyphraseLengthAssessment(),
		new KeywordDensityAssessment(),
		new MetaDescriptionKeywordAssessment(),
		// Text Images assessment here.
	];
};

inherits( RelatedKeywordTaxonomyAssessor, Assessor );

export default RelatedKeywordTaxonomyAssessor;
