import { inherits } from "util";

import Assessor from "../assessor";
import IntroductionKeywordAssessment from "../../assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "../../assessments/seo/KeyphraseLengthAssessment";
import KeyphraseDensityAssessment from "../../assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "../../assessments/seo/MetaDescriptionKeywordAssessment";
import FunctionWordsInKeyphraseAssessment from "../../assessments/seo/FunctionWordsInKeyphraseAssessment";
import MetaDescriptionLengthAssessment from "../../assessments/seo/MetaDescriptionLengthAssessment";
import TextLengthAssessment from "../../assessments/seo/TextLengthAssessment";
import KeyphraseInSEOTitleAssessment from "../../assessments/seo/KeyphraseInSEOTitleAssessment";
import PageTitleWidthAssessment from "../../assessments/seo/PageTitleWidthAssessment";
import SlugKeywordAssessment from "../../assessments/seo/UrlKeywordAssessment";
import SingleH1Assessment from "../../assessments/seo/SingleH1Assessment";

import { createAnchorOpeningTag } from "../../../helpers";

/**
 * Creates the Assessor used for collection pages.
 *
 * @param {Researcher} researcher   The researcher used for the analysis.
 * @param {Object?} options         The options for this assessor.
 * @constructor
 */
const CollectionSEOAssessor = function( researcher, options ) {
	Assessor.call( this, researcher, options );
	this.type = "collectionSEOAssessor";

	this._assessments = [
		new IntroductionKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify8" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify9" ),
		} ),
		new KeyphraseLengthAssessment( {
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
		new MetaDescriptionLengthAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify46" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify47" ),
		} ),
		new TextLengthAssessment( {
			recommendedMinimum: 30,
			slightlyBelowMinimum: 10,
			veryFarBelowMinimum: 1,
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify58" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify59" ),
			customContentType: this.type,
		} ),
		new KeyphraseInSEOTitleAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify24" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify25" ),
		} ),
		new PageTitleWidthAssessment( {
			scores: {
				widthTooShort: 9,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify52" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify53" ),
		}, true ),
		new SlugKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify26" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify27" ),
		} ),
		new FunctionWordsInKeyphraseAssessment(  {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify50" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify51" ),
		} ),
		new SingleH1Assessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify54" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify55" ),
		} ),
	];
};

inherits( CollectionSEOAssessor, Assessor );

export default CollectionSEOAssessor;
