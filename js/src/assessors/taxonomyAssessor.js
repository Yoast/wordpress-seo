const Assessor = require( "yoastseo/js/assessor.js" );

import IntroductionKeywordAssessment from "yoastseo/js/assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "yoastseo/js/assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "yoastseo/js/assessments/seo/KeywordDensityAssessment";
const keywordStopWords = require( "yoastseo/js/assessments/seo/keywordStopWordsAssessment.js" );
import MetaDescriptionKeywordAssessment from "yoastseo/js/assessments/seo/MetaDescriptionKeywordAssessment";
const MetaDescriptionLength = require( "yoastseo/js/assessments/seo/metaDescriptionLengthAssessment.js" );
import TitleKeywordAssessment from "yoastseo/js/assessments/seo/TitleKeywordAssessment";
const TitleWidth = require( "yoastseo/js/assessments/seo/pageTitleWidthAssessment.js" );
import UrlKeywordAssessment from "yoastseo/js/assessments/seo/UrlKeywordAssessment";
const UrlLength = require( "yoastseo/js/assessments/seo/urlLengthAssessment.js" );
const urlStopWords = require( "yoastseo/js/assessments/seo/urlStopWordsAssessment.js" );
const taxonomyTextLength = require( "yoastseo/js/assessments/seo/taxonomyTextLengthAssessment" );

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @constructor
 */
const TaxonomyAssessor = function( i18n ) {
	Assessor.call( this, i18n );

	this._assessments = [
		new IntroductionKeywordAssessment(),
		new KeyphraseLengthAssessment(),
		new KeywordDensityAssessment(),
		keywordStopWords,
		new MetaDescriptionKeywordAssessment(),
		new MetaDescriptionLength(),
		taxonomyTextLength,
		new TitleKeywordAssessment(),
		new TitleWidth(),
		new UrlKeywordAssessment(),
		new UrlLength(),
		urlStopWords,
	];
};

module.exports = TaxonomyAssessor;

require( "util" ).inherits( module.exports, Assessor );

