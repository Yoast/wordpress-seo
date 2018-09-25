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
				/* Translators: %1$s and %2$s open links to an articles about stopwords, %3$s closes the links */
				"%1$sSlug stopwords%3$s: The slug for this page contains a stop word. %2$sRemove it%3$s!",
				"%1$sSlug stopwords%3$s: The slug for this page contains stop words. %2$sRemove them%3$s!",
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
	const urlTitle = "<a href='https://yoa.st/34p' target='_blank'>";
	const urlCallToAction = "<a href='https://yoa.st/34q' target='_blank'>";

	const assessmentResult = new AssessmentResult();
	assessmentResult.setScore( stopWordsResult.score );
	assessmentResult.setText( i18n.sprintf(
		stopWordsResult.text,
		/* Translators: this link is referred to in the content analysis when a slug contains one or more stop words */
		urlTitle,
		urlCallToAction,
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
