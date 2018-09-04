import AssessmentResult from "../../values/AssessmentResult.js";
import getLanguageAvailability from "../../helpers/getLanguageAvailability.js";

const availableLanguages = [ "en" ];

/**
 * Calculate the score based on the amount of stop words in the url.
 *
 * @param {number} stopWordCount The amount of stop words to be checked against.
 * @param {Jed} i18n The locale object.
 *
 * @returns {Object} The resulting score object.
 */
const calculateUrlStopWordsCountResult = function( stopWordCount, i18n ) {
	if ( stopWordCount > 0 ) {
		return {
			score: 5,
			text: i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$s opens a link to a wikipedia article about stop words, %2$s closes the link */
				"The slug for this page contains a %1$sstop word%2$s, consider removing it.",
				"The slug for this page contains %1$sstop words%2$s, consider removing them.",
				stopWordCount
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
const urlHasStopWordsAssessment = function( paper, researcher, i18n ) {
	const stopWords = researcher.getResearch( "stopWordsInUrl" );
	const stopWordsResult = calculateUrlStopWordsCountResult( stopWords.length, i18n );

	const assessmentResult = new AssessmentResult();
	assessmentResult.setScore( stopWordsResult.score );
	assessmentResult.setText( i18n.sprintf(
		stopWordsResult.text,
		/* Translators: this link is referred to in the content analysis when a slug contains one or more stop words */
		"<a href='" + i18n.dgettext( "js-text-analysis", "http://en.wikipedia.org/wiki/Stop_words" ) + "' target='_blank'>",
		"</a>"
	) );

	return assessmentResult;
};

export default {
	identifier: "urlStopWords",
	isApplicable: function( paper ) {
		return getLanguageAvailability( paper.getLocale(), availableLanguages );
	},
	getResult: urlHasStopWordsAssessment,
};
