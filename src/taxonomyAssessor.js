import { inherits } from "util";

import IntroductionKeywordAssessment from "./assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "./assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "./assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "./assessments/seo/MetaDescriptionKeywordAssessment";
import TitleKeywordAssessment from "./assessments/seo/TitleKeywordAssessment";
import UrlKeywordAssessment from "./assessments/seo/UrlKeywordAssessment";
import Assessor from './assessor';
import keywordStopWordsAssessment from './assessments/seo/keywordStopWordsAssessment';
import MetaDescriptionLengthAssessment from './assessments/seo/metaDescriptionLengthAssessment';
import taxonomyTextLengthAssessment from './assessments/seo/taxonomyTextLengthAssessment';
import PageTitleWidthAssessment from './assessments/seo/pageTitleWidthAssessment';
import UrlLengthAssessment from './assessments/seo/urlLengthAssessment';
import urlStopWordsAssessment from './assessments/seo/urlStopWordsAssessment';

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

export default TaxonomyAssessor;

inherits( module.exports, Assessor );
