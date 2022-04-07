import getResearcher from "../../../../packages/yoastseo/spec/specHelpers/getResearcher";
import getLanguage from "yoastseo/src/languageProcessing/helpers/language/getLanguage";

// Import researches
import findKeywordInFirstParagraph from "../../../../packages/yoastseo/src/languageProcessing/researches/findKeywordInFirstParagraph.js";
import keywordCount from "../../../../packages/yoastseo/src/languageProcessing/researches/keywordCount";
import getKeywordDensity from "../../../../packages/yoastseo/src/languageProcessing/researches/getKeywordDensity.js";
import metaDescriptionKeyword from "../../../../packages/yoastseo/src/languageProcessing/researches/metaDescriptionKeyword.js";
import matchKeywordInSubheadings from "../../../../packages/yoastseo/src/languageProcessing/researches/matchKeywordInSubheadings.js";
import imageCount from "../../../../packages/yoastseo/src/languageProcessing/researches/imageCount.js";
import altTagCount from "../../../../packages/yoastseo/src/languageProcessing/researches/altTagCount.js";
import findKeywordInPageTitle from "../../../../packages/yoastseo/src/languageProcessing/researches/findKeywordInPageTitle.js";
import keywordCountInSlug from "../../../../packages/yoastseo/src/languageProcessing/researches/keywordCountInSlug";
import keyphraseDistribution from "../../../../packages/yoastseo/src/languageProcessing/researches/keyphraseDistribution";

/**
 * Runs keyphrase analysis on full-text test papers.
 *
 * @param {array} testPaper 		The papers to analyse.
 * @param {Object} morphologyData 	The morphology data for the language of the test papers.
 *
 * @returns {void}
 */
export default function( testPaper, morphologyData ) {
	const paper = testPaper.paper;
	const locale = paper.getLocale();
	const LanguageResearcher = getResearcher( getLanguage( locale ) );
	const researcher = new LanguageResearcher( paper );
	researcher.addResearchData( "morphology", morphologyData );

	findKeywordInFirstParagraph( paper, researcher );
	getKeywordDensity( paper, researcher );
	keywordCount( paper, researcher );
	metaDescriptionKeyword( paper, researcher );
	matchKeywordInSubheadings( paper, researcher );
	imageCount( paper );
	altTagCount( paper, researcher );
	findKeywordInPageTitle( paper, researcher );
	keywordCountInSlug( paper, researcher );
	keyphraseDistribution( paper, researcher );
}


