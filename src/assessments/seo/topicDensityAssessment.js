const AssessmentResult = require( "../../values/AssessmentResult.js" );
const topicCount = require( "../../researches/topicCount.js" );
const countWords = require( "../../stringProcessing/countWords.js" );
const formatNumber = require( "../../helpers/formatNumber.js" );
const inRange = require( "../../helpers/inRange.js" );
const Mark = require( "../../values/Mark.js" );
const marker = require( "../../markers/addMark.js" );

const inRangeEndInclusive = inRange.inRangeEndInclusive;
const inRangeStartInclusive = inRange.inRangeStartInclusive;
const inRangeStartEndInclusive = inRange.inRangeStartEndInclusive;
const map = require( "lodash/map" );

/**
 * Returns the scores and result text for topic density
 *
 * @param {number} topicDensity The topic density
 * @param {object} i18n The i18n object used for translations
 * @param {number} topicCount The number of times the keyword has been found in the text.
 * @returns {{score: number, text: string}} The assessment result
 */
const calculateTopicDensityResult = function( topicDensity, i18n, topicCount ) {
	let score, text, max;
	const roundedTopicDensity = formatNumber( topicDensity );
	const topicDensityPercentage = roundedTopicDensity + "%";

	if ( roundedTopicDensity > 3.5 ) {
		score = -50;

		/* Translators: %1$s expands to the topic density percentage, %2$d expands to the topic count,
		%3$s expands to the maximum topic density percentage. */
		text = i18n.dgettext( "js-text-analysis", "The topic density is %1$s," +
			" which is way over the advised %3$s maximum;" +
			" the focus keyword and its synonyms were found %2$d times." );

		max = "2.5%";

		text = i18n.sprintf( text, topicDensityPercentage, topicCount, max );
	}

	if ( inRangeEndInclusive( roundedTopicDensity, 2.5, 3.5 ) ) {
		score = -10;

		/* Translators: %1$s expands to the topic density percentage, %2$d expands to the topic count,
		%3$s expands to the maximum topic density percentage. */
		text = i18n.dgettext( "js-text-analysis", "The topic density is %1$s," +
			" which is over the advised %3$s maximum;" +
			" the focus keyword and its synonyms were found %2$d times." );

		max = "2.5%";

		text = i18n.sprintf( text, topicDensityPercentage, topicCount, max );
	}

	if ( inRangeStartEndInclusive( roundedTopicDensity, 0.5, 2.5 ) ) {
		score = 9;

		/* Translators: %1$s expands to the topic density percentage, %2$d expands to the topic count. */
		text = i18n.dgettext( "js-text-analysis", "The topic density is %1$s, which is great;" +
			" the focus keyword and its synonyms were found %2$d times." );

		text = i18n.sprintf( text, topicDensityPercentage, topicCount );
	}

	if ( inRangeStartInclusive( roundedTopicDensity, 0, 0.5 ) ) {
		score = 4;

		/* Translators: %1$s expands to the topic density percentage, %2$d expands to the topic count. */
		text = i18n.dgettext( "js-text-analysis", "The topic density is %1$s, which is too low;" +
			" the focus keyword and its synonyms were found %2$d times." );

		text = i18n.sprintf( text, topicDensityPercentage, topicCount );
	}

	return {
		score: score,
		text: text,
		hasMarks: roundedTopicDensity > 0,
	};
};

/**
 * Runs the getTopicCountDensity module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the AssessmentResult
 */
const topicDensityAssessment = function( paper, researcher, i18n ) {
	const topicDensity = researcher.getResearch( "getTopicDensity" );
	const topicCount = researcher.getResearch( "topicCount" ).count;

	const topicDensityResult = calculateTopicDensityResult( topicDensity, i18n, topicCount );
	const assessmentResult = new AssessmentResult();

	assessmentResult.setScore( topicDensityResult.score );
	assessmentResult.setText( topicDensityResult.text );
	assessmentResult.setHasMarks( topicDensityResult.hasMarks );

	return assessmentResult;
};

/**
 * Marks keywords and synonyms in the text for the topic density assessment.
 *
 * @param {Object} paper The paper to use for the assessment.
 *
 * @returns {Array<Mark>} A list of marks that should be applied.
 */
const getMarks = function( paper ) {
	const topicWords = topicCount( paper ).matches;

	return map( topicWords, function( topicWord ) {
		return new Mark( {
			original: topicWord,
			marked: marker( topicWord ),
		} );
	} );
};

module.exports = {
	identifier: "topicDensity",
	getResult: topicDensityAssessment,
	isApplicable: function( paper ) {
		return paper.hasText() && paper.hasKeyword() && countWords( paper.getText() ) >= 100 && paper.getKeyword().indexOf( "," ) > 0;
	},
	getMarks: getMarks,
};
