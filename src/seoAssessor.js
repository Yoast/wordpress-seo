import { inherits } from "util";

import IntroductionKeywordAssessment from "./assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "./assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "./assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "./assessments/seo/MetaDescriptionKeywordAssessment";
import TextCompetingLinksAssessment from "./assessments/seo/TextCompetingLinksAssessment";
import InternalLinksAssessment from "./assessments/seo/InternalLinksAssessment";
import TitleKeywordAssessment from "./assessments/seo/TitleKeywordAssessment";
import UrlKeywordAssessment from "./assessments/seo/UrlKeywordAssessment";
const Assessor = require( "./assessor" );
const keywordStopWords = require( "./assessments/seo/keywordStopWordsAssessment" );
const MetaDescriptionLength = require( "./assessments/seo/metaDescriptionLengthAssessment" );
const SubheadingsKeyword = require( "./assessments/seo/subheadingsKeywordAssessment" );
const TextImages = require( "./assessments/seo/textImagesAssessment" );
const TextLength = require( "./assessments/seo/textLengthAssessment" );
const OutboundLinks = require( "./assessments/seo/outboundLinksAssessment" );
const TitleWidth = require( "./assessments/seo/pageTitleWidthAssessment" );
const UrlLength = require( "./assessments/seo/urlLengthAssessment" );
const urlStopWords = require( "./assessments/seo/urlStopWordsAssessment" );
/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
const SEOAssessor = function( i18n, options ) {
	Assessor.call( this, i18n, options );

	this._assessments = [
		new IntroductionKeywordAssessment(),
		new KeyphraseLengthAssessment(),
		new KeywordDensityAssessment(),
		keywordStopWords,
		new MetaDescriptionKeywordAssessment(),
		new MetaDescriptionLength(),
		new SubheadingsKeyword(),
		new TextCompetingLinksAssessment(),
		new TextImages(),
		new TextLength(),
		new OutboundLinks(),
		new TitleKeywordAssessment(),
		new InternalLinksAssessment(),
		new TitleWidth(),
		new UrlKeywordAssessment(),
		new UrlLength(),
		urlStopWords,
	];
};

inherits( SEOAssessor, Assessor );

module.exports = SEOAssessor;
