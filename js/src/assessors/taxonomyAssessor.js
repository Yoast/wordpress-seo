const Assessor = require( "yoastseo/js/assessor.js" );

const IntroductionKeyword = require( "yoastseo/js/assessments/seo/introductionKeywordAssessment.js" );
const KeyphraseLength = require( "yoastseo/js/assessments/seo/keyphraseLengthAssessment.js" );
const KeywordDensity = require( "yoastseo/js/assessments/seo/keywordDensityAssessment.js" );
const MetaDescriptionKeyword = require( "yoastseo/js/assessments/seo/metaDescriptionKeywordAssessment.js" );
const MetaDescriptionLength = require( "yoastseo/js/assessments/seo/metaDescriptionLengthAssessment.js" );
const TitleKeyword = require( "yoastseo/js/assessments/seo/titleKeywordAssessment.js" );
const TitleWidth = require( "yoastseo/js/assessments/seo/pageTitleWidthAssessment.js" );
const UrlKeyword = require( "yoastseo/js/assessments/seo/urlKeywordAssessment.js" );
const TextLength = require( "yoastseo/js/assessments/seo/textLengthAssessment.js" );
const InternalLinks = require( "yoastseo/js/assessments/seo/internalLinksAssessment.js" );

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @constructor
 */
const TaxonomyAssessor = function( i18n ) {
	Assessor.call( this, i18n );

	this._assessments = [
		new IntroductionKeyword(),
		new KeyphraseLength(),
		new KeywordDensity(),
		new MetaDescriptionKeyword(),
		new MetaDescriptionLength(),
		new TitleKeyword(),
		new TitleWidth(),
		new UrlKeyword(),
		new TextLength( {
			recommendedMinimum: 250,
			slightlyBelowMinimum: 200,
			belowMinimum: 150,
			veryFarBelowMinimum: 100,
		} ),
		new InternalLinks(),
	];
};

module.exports = TaxonomyAssessor;

require( "util" ).inherits( module.exports, Assessor );
