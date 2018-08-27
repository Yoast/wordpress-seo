import { inherits } from "util";

import IntroductionKeywordAssessment from "./assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "./assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "./assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "./assessments/seo/MetaDescriptionKeywordAssessment";
import TitleKeywordAssessment from "./assessments/seo/TitleKeywordAssessment";
import UrlKeywordAssessment from "./assessments/seo/UrlKeywordAssessment";
const Assessor = require( "./assessor" );
const keywordStopWordsAssessment = require( "./assessments/seo/keywordStopWordsAssessment" );
const MetaDescriptionLengthAssessment = require( "./assessments/seo/metaDescriptionLengthAssessment" );
const taxonomyTextLengthAssessment = require( "./assessments/seo/taxonomyTextLengthAssessment" );
const PageTitleWidthAssessment = require( "./assessments/seo/pageTitleWidthAssessment" );
const UrlLengthAssessment = require( "./assessments/seo/urlLengthAssessment" );
const urlStopWordsAssessment = require( "./assessments/seo/urlStopWordsAssessment" );

/**
 * Creates the Assessor used for taxonomy pages.
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
		keywordStopWordsAssessment,
		new MetaDescriptionKeywordAssessment(),
		new MetaDescriptionLengthAssessment(),
		taxonomyTextLengthAssessment,
		new TitleKeywordAssessment(),
		new PageTitleWidthAssessment(),
		new UrlKeywordAssessment(),
		new UrlLengthAssessment(),
		urlStopWordsAssessment,
	];
};

module.exports = TaxonomyAssessor;

inherits( module.exports, Assessor );
