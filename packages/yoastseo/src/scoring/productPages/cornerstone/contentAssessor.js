import Assessor from "../../assessor.js";
import ContentAssessor from "../../contentAssessor";
import paragraphTooLong from "../../assessments/readability/paragraphTooLongAssessment.js";
import SentenceLengthInText from "../../assessments/readability/sentenceLengthInTextAssessment.js";
import SubheadingDistributionTooLong from "../../assessments/readability/subheadingDistributionTooLongAssessment.js";
import transitionWords from "../../assessments/readability/transitionWordsAssessment.js";
import passiveVoice from "../../assessments/readability/passiveVoiceAssessment.js";
import textPresence from "../../assessments/readability/textPresenceAssessment.js";

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
const ProductCornerstoneContentAssessor = function( i18n, options = {} ) {
	Assessor.call( this, i18n, options );
	this.type = "productCornerstoneContentAssessor";

	this._assessments = [
		new SubheadingDistributionTooLong( {
			parameters:	{
				slightlyTooMany: 250,
				farTooMany: 300,
				recommendedMaximumWordCount: 250,
			},
		} ),
		paragraphTooLong,
		new SentenceLengthInText( true ),
		transitionWords,
		passiveVoice,
		textPresence,
	];
};

require( "util" ).inherits( ProductCornerstoneContentAssessor, ContentAssessor );


export default ProductCornerstoneContentAssessor;

