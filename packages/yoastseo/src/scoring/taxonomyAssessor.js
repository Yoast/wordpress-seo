import { inherits } from "util";

import IntroductionKeywordAssessment from "./assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "./assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "./assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "./assessments/seo/MetaDescriptionKeywordAssessment";
import KeyphraseInSEOTitleAssessment from "./assessments/seo/KeyphraseInSEOTitleAssessment";
import SlugKeywordAssessment from "./assessments/seo/UrlKeywordAssessment";
import Assessor from "./assessor";
import MetaDescriptionLengthAssessment from "./assessments/seo/MetaDescriptionLengthAssessment";
import TextLengthAssessment from "./assessments/seo/TextLengthAssessment";
import PageTitleWidthAssessment from "./assessments/seo/PageTitleWidthAssessment";
import FunctionWordsInKeyphrase from "./assessments/seo/FunctionWordsInKeyphraseAssessment";
import SingleH1Assessment from "./assessments/seo/SingleH1Assessment";
import { createAnchorOpeningTag } from "../helpers/shortlinker";

/**
 * Returns the text length assessment to use.
 *
 * @returns {TextLengthAssessment} The text length assessment (with taxonomy configuration) to use.
 */
export const getTextLengthAssessment = function() {
	// Export so it can be used in tests.
	return new TextLengthAssessment( {
		recommendedMinimum: 250,
		slightlyBelowMinimum: 200,
		belowMinimum: 100,
		veryFarBelowMinimum: 50,
		urlTitle: createAnchorOpeningTag( "https://yoa.st/34j" ),
		urlCallToAction: createAnchorOpeningTag( "https://yoa.st/34k" ),
		customContentType: "taxonomyAssessor",
	} );
};

/**
 * Creates the Assessor used for taxonomy pages.
 *
 * @param {object} researcher   The researcher used for the analysis.
 * @param {Object} options      The options for this assessor.
 * @constructor
 */
const TaxonomyAssessor = function( researcher, options ) {
	Assessor.call( this, researcher, options );
	this.type = "taxonomyAssessor";

	this._assessments = [
		new IntroductionKeywordAssessment(),
		new KeyphraseLengthAssessment(),
		new KeywordDensityAssessment(),
		new MetaDescriptionKeywordAssessment(),
		new MetaDescriptionLengthAssessment(),
		getTextLengthAssessment(),
		new KeyphraseInSEOTitleAssessment(),
		new PageTitleWidthAssessment(
			{
				scores: {
					widthTooShort: 9,
				},
			}, true
		),
		new SlugKeywordAssessment(),
		new FunctionWordsInKeyphrase(),
		new SingleH1Assessment(),
	];
};

inherits( TaxonomyAssessor, Assessor );

export default TaxonomyAssessor;
