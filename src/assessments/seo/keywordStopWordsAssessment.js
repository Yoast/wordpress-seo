import getLanguageAvailability from "../../helpers/getLanguageAvailability";
import { createAnchorOpeningTag } from "../../helpers/queryStringAppender";
import AssessmentResult from "../../values/AssessmentResult";

const availableLanguages = [ "en" ];

/**
 * Calculate the score based on the amount of stop words in the keyword.
 *
 * @param {number} stopWordCount The amount of stop words to be checked against.
 * @param {Jed} i18n The locale object.
 *
 * @returns {Object} The resulting score object.
 *
 * @deprecated
 */
var calculateStopWordsCountResult = function( stopWordCount, i18n ) {
	if ( stopWordCount > 0 ) {
		return {
			score: 0,
			text: i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$s and %2$s open links to Yoast articles, %3$s is the anchor end tag */
				"%1$sStopwords%3$s: The keyphrase contains stop words. " +
				"This may or may not be wise depending on the circumstances. " +
				"%2$sLearn more about stop words%3$s.",
			),
		};
	}

	return {};
};

/**
 * Execute the Assessment and return a result.
 *
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {Jed} i18n The locale object.
 *
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
const keywordHasStopWordsAssessment = function( paper, researcher, i18n ) {
	var stopWords = researcher.getResearch( "stopWordsInKeyword" );
	var stopWordsResult = calculateStopWordsCountResult( stopWords.length, i18n );

	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( stopWordsResult.score );
	assessmentResult.setText( i18n.sprintf(
		stopWordsResult.text,
		createAnchorOpeningTag( "https://yoa.st/34b" ),
		createAnchorOpeningTag( "https://yoa.st/34c" ),
		"</a>",
		stopWords.length
	) );

	return assessmentResult;
};

export default {
	identifier: "keywordStopWords",
	getResult: keywordHasStopWordsAssessment,
	isApplicable: function( paper ) {
		var isLanguageAvailable = getLanguageAvailability( paper.getLocale(), availableLanguages );
		return paper.hasKeyword() && isLanguageAvailable;
	},
};
