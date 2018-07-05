var AssessmentResult = require( "../../values/AssessmentResult.js" );
var countWords = require( "../../stringProcessing/countWords.js" );
var formatNumber = require( "../../helpers/formatNumber.js" );
var inRange = require( "../../helpers/inRange.js" );

var inRangeEndInclusive = inRange.inRangeEndInclusive;
var inRangeStartEndInclusive = inRange.inRangeStartEndInclusive;
const topicCount = require( "../../researches/topicCount" );

/**
 * Returns the scores and text for keyword density
 *
 * @param {number} keywordDensity The keyword density
 * @param {object} i18n The i18n object used for translations
 * @param {number} keywordCount The number of times the keyword has been found in the text.
 * @returns {{score: number, text: *}} The assessment result
 */
var calculateKeywordDensityResult = function( keywordDensity, i18n, keywordCount ) {
	var score, text;
	const max = "2.5%";
	var roundedKeywordDensity = formatNumber( keywordDensity );
	var keywordDensityPercentage = roundedKeywordDensity + "%";
	const url = "<a href='https://yoa.st/2pe' target='_blank'>";

	if ( roundedKeywordDensity > 3.5 ) {
		score = -50;

		/* Translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count,
		%3$s expands to the maximum keyword density percentage, %4$s expands to a link to a Yoast.com article
		about keyword density, %5$s expands to the anchor end tag. */
		text = i18n.dngettext(
			"js-text-analysis",
			"The %4$skeyword density%5$s is %1$s, which is way over the advised %3$s maximum; the focus keyword was found %2$d time.",
			"The %4$skeyword density%5$s is %1$s, which is way over the advised %3$s maximum; the focus keyword was found %2$d times.",
			keywordCount
		);

		text = i18n.sprintf( text, keywordDensityPercentage, keywordCount, max, url, "</a>" );
	}

	if ( inRangeEndInclusive( roundedKeywordDensity, 2.5, 3.5 ) ) {
		score = -10;

		/* Translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count,
		%3$s expands to the maximum keyword density percentage, %4$s expands to a link to a Yoast.com article
		about keyword density, %5$s expands to the anchor end tag. */
		text = i18n.dngettext(
			"js-text-analysis",
			"The %4$skeyword density%5$s is %1$s, which is over the advised %3$s maximum; the focus keyword was found %2$d time.",
			"The %4$skeyword density%5$s is %1$s, which is over the advised %3$s maximum; the focus keyword was found %2$d times.",
			keywordCount
		);

		text = i18n.sprintf( text, keywordDensityPercentage, keywordCount, max, url, "</a>" );
	}

	if ( inRangeStartEndInclusive( roundedKeywordDensity, 0.5, 2.5 ) ) {
		score = 9;

		/* Translators:	%1$s expands to the keyword density percentage,	%2$d expands to the keyword count,
		%3$s expands to a link to a Yoast.com article about keyword density,
		%4$s expands to the anchor end tag. */
		text = i18n.dngettext(
			"js-text-analysis",
			"The %3$skeyword density%4$s is %1$s, which is great; the focus keyword was found %2$d time.",
			"The %3$skeyword density%4$s is %1$s, which is great; the focus keyword was found %2$d times.",
			keywordCount
		);

		text = i18n.sprintf( text, keywordDensityPercentage, keywordCount, url, "</a>" );
	}

	if ( roundedKeywordDensity < 0.5 && keywordCount === 0 ) {
		score = 4;

		/* Translators:	%1$s expands to the keyword density percentage,	%2$d expands to the keyword count,
		%3$s expands to a link to a Yoast.com article about keyword density,
		%4$s expands to the anchor end tag. */
		text = i18n.dgettext(
			"js-text-analysis",
			"The %3$skeyword density%4$s is %1$s, which is too low; the focus keyword was found %2$d times."
		);

		text = i18n.sprintf( text, keywordDensityPercentage, keywordCount, url, "</a>" );
	}

	if ( roundedKeywordDensity < 0.5 && ! ( keywordCount === 0 ) ) {
		score = 4;

		/* Translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count,
		%3$s expands to a link to a Yoast.com article about keyword density,
		%4$s expands to the anchor end tag. */
		text = i18n.dngettext(
			"js-text-analysis",
			"The %3$skeyword density%4$s is %1$s, which is too low; the focus keyword was found %2$d time.",
			"The %3$skeyword density%4$s is %1$s, which is too low; the focus keyword was found %2$d times.",
			keywordCount
		);

		text = i18n.sprintf( text, keywordDensityPercentage, keywordCount, url, "</a>" );
	}

	return {
		score: score,
		text: text,
	};
};

/**
 * Marks keywords in the text for the keyword density assessment.
 *
 * @param {Object} paper The paper to use for the assessment.
 *
 * @returns {Array<Mark>} Marks that should be applied.
 */
var getMarks = function( paper ) {
	return topicCount( paper ).markings;
};

/**
 * Runs the getkeywordDensity module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var keywordDensityAssessment = function( paper, researcher, i18n ) {
	var keywordDensity = researcher.getResearch( "getKeywordDensity" );
	var keywordCount = researcher.getResearch( "keywordCount" );
	var keywordDensityResult = calculateKeywordDensityResult( keywordDensity, i18n, keywordCount.count );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( keywordDensityResult.score );
	assessmentResult.setText( keywordDensityResult.text );
	assessmentResult.setHasMarks( keywordCount.count > 0 );

	return assessmentResult;
};

module.exports = {
	identifier: "keywordDensity",
	getResult: keywordDensityAssessment,
	isApplicable: function( paper ) {
		return paper.hasText() && paper.hasKeyword() && countWords( paper.getText() ) >= 100;
	},
	getMarks: getMarks,
};
