import { inherits } from "util";
import { createAnchorOpeningTag } from "../../helpers/shortlinker";

import IntroductionKeywordAssessment from "./../assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "./../assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "./../assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "./../assessments/seo/MetaDescriptionKeywordAssessment";
import TitleKeywordAssessment from "./../assessments/seo/TitleKeywordAssessment";
import UrlKeywordAssessment from "./../assessments/seo/UrlKeywordAssessment";
import Assessor from "./../assessor";
import MetaDescriptionLengthAssessment from "./../assessments/seo/MetaDescriptionLengthAssessment";
import TextLengthAssessment from "./../assessments/seo/TextLengthAssessment";
import PageTitleWidthAssessment from "./../assessments/seo/PageTitleWidthAssessment";
import FunctionWordsInKeyphrase from "./../assessments/seo/FunctionWordsInKeyphraseAssessment";
import SingleH1Assessment from "./../assessments/seo/SingleH1Assessment";
import KeyphraseDistribution from "./../assessments/seo/KeyphraseDistributionAssessment";

/**
 * Creates the Assessor used for collection pages.
 *
 * @param {object} researcher   The researcher used for the analysis.
 * @param {Object} options      The options for this assessor.
 * @constructor
 */
const CollectionSEOAssessor = function( researcher, options ) {
	Assessor.call( this, researcher, options );
	this.type = "CollectionSEOAssessor";

	this._assessments = [
		new IntroductionKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify8" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify9" ),
		} ),
		new KeyphraseLengthAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify10" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify11" ),
		} ),
		new KeywordDensityAssessment( {
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
			recommendedMinimum: 80,
			slightlyBelowMinimum: 50,
			belowMinimum: 20,
			veryFarBelowMinimum: 10,
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify58" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify59" ),
			customContentType: this.type,
		} ),
		new TitleKeywordAssessment( {
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
		new UrlKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify26" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify27" ),
		} ),
		new FunctionWordsInKeyphrase(  {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify50" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify51" ),
		} ),
		new SingleH1Assessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify54" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify55" ),
		} ),
		new KeyphraseDistribution( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify30" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify31" ),
		} ),
	];
};

inherits( CollectionSEOAssessor, Assessor );

export default CollectionSEOAssessor;
