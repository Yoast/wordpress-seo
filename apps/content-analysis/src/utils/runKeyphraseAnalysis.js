import getResearcher from "yoastspec/specHelpers/getResearcher";
import getLanguage from "yoastseo/src/languageProcessing/helpers/language/getLanguage";

// Import researches
import findKeywordInFirstParagraph from "yoastseo/src/languageProcessing/researches/findKeywordInFirstParagraph.js";
import keywordCount from "yoastseo/src/languageProcessing/researches/keywordCount";
import getKeyphraseDensity from "yoastseo/src/languageProcessing/researches/getKeywordDensity.js";
import metaDescriptionKeyword from "yoastseo/src/languageProcessing/researches/metaDescriptionKeyword.js";
import matchKeywordInSubheadings from "yoastseo/src/languageProcessing/researches/matchKeywordInSubheadings.js";
import imageCount from "yoastseo/src/languageProcessing/researches/imageCount.js";
import altTagCount from "yoastseo/src/languageProcessing/researches/altTagCount.js";
import findKeyphraseInSEOTitle from "yoastseo/src/languageProcessing/researches/findKeyphraseInSEOTitle.js";
import keywordCountInSlug from "yoastseo/src/languageProcessing/researches/keywordCountInUrl";
import keyphraseDistribution from "yoastseo/src/languageProcessing/researches/keyphraseDistribution";

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
	getKeyphraseDensity( paper, researcher );
	keywordCount( paper, researcher );
	metaDescriptionKeyword( paper, researcher );
	matchKeywordInSubheadings( paper, researcher );
	imageCount( paper );
	altTagCount( paper, researcher );
	findKeyphraseInSEOTitle( paper, researcher );
	keywordCountInSlug( paper, researcher );
	keyphraseDistribution( paper, researcher );
}


