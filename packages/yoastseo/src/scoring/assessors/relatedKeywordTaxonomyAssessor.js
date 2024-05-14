import { inherits } from "util";
import Assessor from "./assessor.js";
import IntroductionKeywordAssessment from "../assessments/seo/IntroductionKeywordAssessment.js";
import KeyphraseLengthAssessment from "../assessments/seo/KeyphraseLengthAssessment.js";
import KeyphraseDensityAssessment from "../assessments/seo/KeywordDensityAssessment.js";
import MetaDescriptionKeywordAssessment from "../assessments/seo/MetaDescriptionKeywordAssessment.js";
import FunctionWordsInKeyphrase from "../assessments/seo/FunctionWordsInKeyphraseAssessment.js";

/**
 * Creates the Assessor used for taxonomy pages.
 *
 * @param {Researcher}  researcher  The researcher to use for the analysis.
 * @param {Object?}  options        The options for this assessor.
 *
 * @constructor
 */
const RelatedKeywordTaxonomyAssessor = function( researcher, options ) {
	Assessor.call( this, researcher, options );
	this.type = "relatedKeywordsTaxonomyAssessor";

	this._assessments = [
		new IntroductionKeywordAssessment(),
		new KeyphraseLengthAssessment( { isRelatedKeyphrase: true } ),
		new KeyphraseDensityAssessment(),
		new MetaDescriptionKeywordAssessment(),
		// Text Images assessment here.
		new FunctionWordsInKeyphrase(),
	];
};

inherits( RelatedKeywordTaxonomyAssessor, Assessor );

export default RelatedKeywordTaxonomyAssessor;
