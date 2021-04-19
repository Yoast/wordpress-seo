import AssessmentResult from "../../values/AssessmentResult";
import getLanguageAvailability from "../../helpers/getLanguageAvailability";
import { createAnchorOpeningTag } from "../../helpers/shortlinker";

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
	const urlTitle = createAnchorOpeningTag( "https://yoa.st/34p" );
	const urlCallToAction = createAnchorOpeningTag( "https://yoa.st/34q" );

	if ( stopWordCount > 0 ) {
		return {
			score: 5,
			text: i18n.sprintf(
				/* Translators: %1$s and %2$s open links to an articles about stopwords, %3$s closes the links */
				i18n.dngettext(
					"js-text-analysis",
					"%1$sSlug stopwords%3$s: The slug for this page contains a stop word. %2$sRemove it%3$s!",
					"%1$sSlug stopwords%3$s: The slug for this page contains stop words. %2$sRemove them%3$s!",
					stopWordCount
				),
				urlTitle,
				urlCallToAction,
				"</a>"
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
 *
 * @deprecated since 1.48. We have removed it from the assessments since we do not consider it an important SEO factor anymore.
 */
const urlHasStopWordsAssessment = function( paper, researcher, i18n ) {
	console.warn( "Deprecation Warning: The UrlLengthAssessment has been deprecated since version 1.48. " +
		"We have removed it from the assessments since we do not consider it an important SEO factor anymore." );

	const stopWords = researcher.getResearch( "stopWordsInUrl" );

	const assessmentResult = new AssessmentResult();

	const stopWordsResult = calculateUrlStopWordsCountResult( stopWords.length, i18n );

	assessmentResult.setScore( stopWordsResult.score );
	assessmentResult.setText( stopWordsResult.text );

	return assessmentResult;
};

/**
 * Checks if there is a list of stopwords for the language of the paper.
 *
 * @param {Object} paper The paper to check.
 *
 * @returns {boolean} Returns true if the language is available.
 */
const isApplicable = function( paper ) {
	return getLanguageAvailability( paper.getLocale(), availableLanguages );
};


export default {
	identifier: "urlStopWords",
	isApplicable: isApplicable,
	getResult: urlHasStopWordsAssessment,
};
