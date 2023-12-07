import buildTree from "../specHelpers/parse/buildTree";
import getMorphologyData from "../specHelpers/getMorphologyData";
import getLanguage from "../../src/languageProcessing/helpers/language/getLanguage";
import { getLanguagesWithWordComplexity } from "../../src/helpers";
import wordComplexity from "../../src/languageProcessing/researches/wordComplexity";
import getWordComplexityHelper from "../specHelpers/getWordComplexityHelper";
import getWordComplexityConfig from "../specHelpers/getWordComplexityConfig";
import getResearcher from "../specHelpers/getResearcher";
import keyphraseDistribution from "../../src/languageProcessing/researches/keyphraseDistribution";
import getLongCenterAlignedTexts from "../../src/languageProcessing/researches/getLongCenterAlignedTexts";
import { paper as englishPaper } from "../fullTextTests/testTexts/en/englishPaper";


const RESEARCHES = [ "altTagCount", "countSentencesFromText", "findKeyphraseInSEOTitle", "findKeywordInFirstParagraph",
	"findTransitionWords", "functionWordsInKeyphrase", "getAnchorsWithKeyphrase", "getFleschReadingScore", "getKeyphraseDensity", "getLinks",
	"getLinkStatistics", "getLongCenterAlignedTexts", "getParagraphLength", "getPassiveVoice",
	"getProminentWordsForInsights", "getProminentWordsForInternalLinking",
	"getSentenceBeginnings", "getSubheadingTextLengths", "getWordForms", "h1s", "imageCount", "keyphraseDistribution", "keyphraseLength",
	"getKeyphraseCount", "keywordCountInSlug", "matchKeywordInSubheadings", "metaDescriptionKeyword", "metaDescriptionLength",
	"morphology", "pageTitleWidth", "readingTime", "sentences", "videoCount", "wordComplexity", "wordCountInText" ];

describe( "performance test", function() {
	/**
	 * Object to store a research and its performance.
	 * @param {string} research The researcher.
	 * @param {number} timeElapsed The time elapsed.
	 * @constructor
	 */
	function Result( research, timeElapsed ) {
		this.research = research;
		this.time = timeElapsed;
	}

	/**
	 * Executes and times a research from a researcher.
	 * @param {Researcher} researcher The researcher.
	 * @param {string} research The name of the research.
	 * @returns {Result} The Result.
	 */
	function assess( researcher, research ) {
		const startTime = new Date();
		researcher.getResearch( research );
		const timeElapsed = new Date() - startTime;

		return new Result( research, timeElapsed );
	}

	/**
	 * Retrieves all results on the researches for a given paper and researcher.
	 *
	 * @param {Paper} paper The paper.
	 * @param {Researcher} researcher The researcher.
	 *
	 * @returns {Result[]} An array of Results.
	 */
	function assessAll( paper, researcher ) {
		return RESEARCHES.map( research => assess( researcher, research ) );
	}

	it( "should perform!", function() {
		const paper = englishPaper;
		const locale = paper.getLocale();
		const language = getLanguage( locale );

		const LanguageResearcher = getResearcher( language );
		const researcher = new LanguageResearcher( paper );

		researcher.addResearchData( "morphology", getMorphologyData( language ) );
		researcher.addResearch( "keyphraseDistribution", keyphraseDistribution );
		// Also register the research, helper, and config for Word Complexity for testing purposes.
		if ( getLanguagesWithWordComplexity().includes( language ) ) {
			researcher.addResearch( "wordComplexity", wordComplexity );
			researcher.addHelper( "checkIfWordIsComplex", getWordComplexityHelper( language ) );
			researcher.addConfig( "wordComplexity", getWordComplexityConfig( language ) );
		}
		researcher.addResearch( "getLongCenterAlignedTexts", getLongCenterAlignedTexts );

		buildTree( paper, researcher );

		const results = assessAll( paper, researcher );
		// eslint-disable-next-line no-console
		console.table( results );
	} );
} );
