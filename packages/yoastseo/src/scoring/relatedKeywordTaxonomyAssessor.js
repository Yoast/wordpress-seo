import { inherits } from "util";

import IntroductionKeywordAssessment from "./assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "./assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "./assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "./assessments/seo/MetaDescriptionKeywordAssessment";
import Assessor from "./assessor";
import FunctionWordsInKeyphrase from "./assessments/seo/FunctionWordsInKeyphraseAssessment";

/**
 * Creates the Assessor used for taxonomy pages.
 *
 * @param {object}  researcher  The researcher to use for the analysis.
 * @param {Object}  options     The options for this assessor.
 *
 * @constructor
 */
const RelatedKeywordTaxonomyAssessor = function( researcher, options ) {
	Assessor.call( this, researcher, options );
	this.type = "relatedKeywordsTaxonomyAssessor";

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
