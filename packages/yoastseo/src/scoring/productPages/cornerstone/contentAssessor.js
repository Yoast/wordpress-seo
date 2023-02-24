import { Assessor, ContentAssessor, assessments, helpers } from "yoastseo";
const { createAnchorOpeningTag } = helpers;

const {
	ParagraphTooLong,
	SentenceLengthInText,
	SubheadingDistributionTooLong,
	TransitionWords,
	PassiveVoice,
	TextPresence,
	ListsPresence,
} = assessments.readability;


/**
 * Creates the Assessor
 *
 * @param {object} researcher   The researcher to use for the analysis.
 * @param {Object} options      The options for this assessor.
 *
 * @constructor
 */
const ProductCornerstoneContentAssessor = function( researcher, options ) {
	Assessor.call( this, researcher, options );
	this.type = "productCornerstoneContentAssessor";

	this._assessments = [
		new SubheadingDistributionTooLong( {
			parameters:	{
				slightlyTooMany: 250,
				farTooMany: 300,
				recommendedMaximumLength: 250,
			},
			applicableIfTextLongerThan: 250,
			shouldNotAppearInShortText: true,
			urlTitle: createAnchorOpeningTag( options.subheadingUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.subheadingCTAUrl ),
			cornerstoneContent: true,
		} ),
		new ParagraphTooLong( {
			parameters: {
				recommendedLength: 70,
				maximumRecommendedLength: 100,
			},
			urlTitle: createAnchorOpeningTag( options.paragraphUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.paragraphCTAUrl ),
		}, true ),
		new SentenceLengthInText( {
			slightlyTooMany: 15,
			farTooMany: 20,
			urlTitle: createAnchorOpeningTag( options.sentenceLengthUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.sentenceLengthCTAUrl ),
		}, true, true ),
		new TransitionWords( {
			urlTitle: createAnchorOpeningTag( options.transitionWordsUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.transitionWordsCTAUrl ),
		} ),
		new PassiveVoice( {
			urlTitle: createAnchorOpeningTag( options.passiveVoiceUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.passiveVoiceCTAUrl ),
		} ),
		new TextPresence( {
			urlTitle: createAnchorOpeningTag( options.textPresenceUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.textPresenceCTAUrl ),
		} ),
		new ListsPresence( {
			urlTitle: createAnchorOpeningTag( options.listsUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.listsCTAUrl ),
		} ),
	];
};

require( "util" ).inherits( ProductCornerstoneContentAssessor, ContentAssessor );


export default ProductCornerstoneContentAssessor;

