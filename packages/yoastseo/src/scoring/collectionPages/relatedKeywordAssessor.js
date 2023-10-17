import { inherits } from "util";

import { Assessor, assessments, helpers } from "yoastseo";
const { createAnchorOpeningTag } = helpers;

const {
	IntroductionKeywordAssessment,
	KeyphraseLengthAssessment,
	KeyphraseDensityAssessment,
	MetaDescriptionKeywordAssessment,
	FunctionWordsInKeyphraseAssessment,
} = assessments.seo;

/**
 * Creates the Assessor used for collection pages.
 *
 * @param {Researcher}  researcher  The researcher to use for the analysis.
 * @param {Object?}     options     The options for this assessor.
 *
 * @constructor
 */
const CollectionRelatedKeywordAssessor = function( researcher, options ) {
	Assessor.call( this, researcher, options );
	this.type = "collectionRelatedKeywordAssessor";

	this._assessments = [
		new IntroductionKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify8" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify9" ),
		} ),
		new KeyphraseLengthAssessment( {
			isRelatedKeyphrase: true,
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify10" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify11" ),
		} ),
		new KeyphraseDensityAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify12" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify13" ),
		} ),
		new MetaDescriptionKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify14" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify15" ),
		} ),
		new FunctionWordsInKeyphraseAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify50" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify51" ),
		} ),
	];
};

inherits( CollectionRelatedKeywordAssessor, Assessor );

export default CollectionRelatedKeywordAssessor;
