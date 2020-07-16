import Researcher from "yoastsrc/researcher";

// Import researches
import findKeywordInFirstParagraph from "../../../../packages/yoastseo/src/researches/findKeywordInFirstParagraph.js";
import keywordCount from "yoastsrc/researches/keywordCount";
import getKeywordDensity from "../../../../packages/yoastseo/src/researches/getKeywordDensity.js";
import metaDescriptionKeyword from "../../../../packages/yoastseo/src/researches/metaDescriptionKeyword.js";
import matchKeywordInSubheadings from "../../../../packages/yoastseo/src/researches/matchKeywordInSubheadings.js";
import imageCount from "../../../../packages/yoastseo/src/researches/imageCountInText.js";
import altTagCount from "../../../../packages/yoastseo/src/researches/imageAltTags.js";
import findKeywordInPageTitle from "../../../../packages/yoastseo/src/researches/findKeywordInPageTitle.js";
import keywordCountInUrl from "yoastsrc/researches/keywordCountInUrl";
import { keyphraseDistributionResearcher } from "yoastsrc/researches/keyphraseDistribution";
const keyphraseDistribution = keyphraseDistributionResearcher;

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
	const researcher = new Researcher( paper );
	researcher.addResearchData( "morphology", morphologyData );

	findKeywordInFirstParagraph( paper, researcher );
	getKeywordDensity( paper, researcher );
	keywordCount( paper, researcher );
	metaDescriptionKeyword( paper, researcher );
	matchKeywordInSubheadings( paper, researcher );
	imageCount( paper );
	altTagCount( paper, researcher );
	findKeywordInPageTitle( paper, researcher );
	keywordCountInUrl( paper, researcher );
	keyphraseDistribution( paper, researcher );
}


