import { inherits } from "util";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import Assessor from "../../assessor.js";

import IntroductionKeyword from "../../assessments/seo/IntroductionKeywordAssessment.js";
import KeyphraseLength from "../../assessments/seo/KeyphraseLengthAssessment.js";
import KeywordDensity from "../../assessments/seo/KeywordDensityAssessment.js";
import MetaDescriptionKeyword from "../../assessments/seo/MetaDescriptionKeywordAssessment.js";
import ImageKeyphrase from "../../assessments/seo/KeyphraseInImageTextAssessment";
import TextCompetingLinks from "../../assessments/seo/TextCompetingLinksAssessment.js";
import FunctionWordsInKeyphrase from "../../assessments/seo/FunctionWordsInKeyphraseAssessment";

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
const ProductCornerStoneRelatedKeywordAssessor = function( i18n, options ) {
	Assessor.call( this, i18n, options );
	this.type = "productPageCornerstoneRelatedKeywordAssessor";

	this._assessments = [
		new IntroductionKeyword( {
			urlTitle: createAnchorOpeningTag( options.introductionKeyphraseUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.introductionKeyphraseCTAUrl ),
		} ),
		new KeyphraseLength( {
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
		new KeywordDensity( {
			urlTitle: createAnchorOpeningTag( options.keyphraseDensityUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.keyphraseDensityCTAUrl ),
		} ),
		new MetaDescriptionKeyword( {
			urlTitle: createAnchorOpeningTag( options.metaDescriptionKeyphraseUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.metaDescriptionKeyphraseCTAUrl ),
		} ),
		new TextCompetingLinks( {
			urlTitle: createAnchorOpeningTag( options.textCompetingLinksUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.textCompetingLinksCTAUrl ),
		} ),
		new FunctionWordsInKeyphrase( {
			urlTitle: createAnchorOpeningTag( options.functionWordsInKeyphraseUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.functionWordsInKeyphraseCTAUrl ),
		} ),
		new ImageKeyphrase( {
			scores: {
				withAltNonKeyword: 3,
				withAlt: 3,
				noAlt: 3,
			},
			urlTitle: createAnchorOpeningTag( options.imageKeyphraseUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.imageKeyphraseCTAUrl ),
		} ),
	];
};

inherits( ProductCornerStoneRelatedKeywordAssessor, Assessor );

export default ProductCornerStoneRelatedKeywordAssessor;
