import { inherits } from "util";

import { Assessor, assessments, helpers } from "yoastseo";
const { createAnchorOpeningTag } = helpers;

const {
	IntroductionKeywordAssessment,
	KeyphraseLengthAssessment,
	KeyphraseDensityAssessment,
	MetaDescriptionKeywordAssessment,
	TextCompetingLinksAssessment,
	ImageKeyphraseAssessment,
	FunctionWordsInKeyphraseAssessment,
} = assessments.seo;

/**
 * Creates the Assessor
 *
 * @param {Researcher} researcher   The researcher to use for the analysis.
 * @param {Object?} options         The options for this assessor.
 *
 * @constructor
 */
const ProductRelatedKeywordAssessor = function( researcher, options ) {
	Assessor.call( this, researcher, options );
	this.type = "productPageRelatedKeywordAssessor";

	this._assessments = [
		new IntroductionKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( options.introductionKeyphraseUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.introductionKeyphraseCTAUrl ),
		} ),
		new KeyphraseLengthAssessment( {
			parameters: {
				recommendedMinimum: 4,
				recommendedMaximum: 6,
				acceptableMaximum: 8,
				acceptableMinimum: 2,
			},
			isRelatedKeyphrase: true,
			urlTitle: createAnchorOpeningTag( options.keyphraseLengthUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.keyphraseLengthCTAUrl ),
		}, true ),
		new KeyphraseDensityAssessment( {
			urlTitle: createAnchorOpeningTag( options.keyphraseDensityUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.keyphraseDensityCTAUrl ),
		} ),
		new MetaDescriptionKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( options.metaDescriptionKeyphraseUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.metaDescriptionKeyphraseCTAUrl ),
		} ),
		new TextCompetingLinksAssessment( {
			urlTitle: createAnchorOpeningTag( options.textCompetingLinksUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.textCompetingLinksCTAUrl ),
		} ),
		new FunctionWordsInKeyphraseAssessment( {
			urlTitle: createAnchorOpeningTag( options.functionWordsInKeyphraseUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.functionWordsInKeyphraseCTAUrl ),
		} ),
		new ImageKeyphraseAssessment( {
			urlTitle: createAnchorOpeningTag( options.imageKeyphraseUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.imageKeyphraseCTAUrl ),
		} ),
	];
};

inherits( ProductRelatedKeywordAssessor, Assessor );

export default ProductRelatedKeywordAssessor;
