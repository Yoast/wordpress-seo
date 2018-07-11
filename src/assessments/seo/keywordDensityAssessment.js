var AssessmentResult = require( "../../values/AssessmentResult.js" );
const keywordCount = require( "../../researches/keywordCount.js" );
var countWords = require( "../../stringProcessing/countWords.js" );
var formatNumber = require( "../../helpers/formatNumber.js" );
var inRange = require( "../../helpers/inRange.js" );
const Mark = require( "../../values/Mark.js" );
const marker = require( "../../markers/addMark.js" );

var inRangeEndInclusive = inRange.inRangeEndInclusive;
var inRangeStartInclusive = inRange.inRangeStartInclusive;
var inRangeStartEndInclusive = inRange.inRangeStartEndInclusive;
const map = require( "lodash/map" );

/**
 * Returns the scores and text for keyword density
 *
 * @param {string} keywordDensity The keyword density
 * @param {object} i18n The i18n object used for translations
 * @param {number} keywordCount The number of times the keyword has been found in the text.
 * @returns {{score: number, text: *}} The assessment result
 */
var calculateKeywordDensityResult = function( keywordDensity, i18n, keywordCount ) {
	var score, text, max;
	var roundedKeywordDensity = formatNumber( keywordDensity );
	var keywordDensityPercentage = roundedKeywordDensity + "%";
	const url = "<a href='https://yoa.st/2pe' target='_blank'>";

	if ( roundedKeywordDensity > 3.5 ) {
		score = -50;

		/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag,
		%3$s expands to the keyword density percentage, %4$d expands to the keyword count,
		%5$s expands to the maximum keyword density percentage. */
		text = i18n.dgettext( "js-text-analysis", "The %1$skeyword density%2$s is %3$s," +
			" which is way over the advised %5$s maximum;" +
			" the focus keyword was found %4$d times." );

		max = "2.5%";

		text = i18n.sprintf( text, url, "</a>", keywordDensityPercentage, keywordCount, max );
	}

	if ( inRangeEndInclusive( roundedKeywordDensity, 2.5, 3.5 ) ) {
		score = -10;

		/* Translators:  %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag,
		%3$s expands to the keyword density percentage, %4$d expands to the keyword count,
		%5$s expands to the maximum keyword density percentage. */
		text = i18n.dgettext( "js-text-analysis", "The %1$skeyword density%2$s is %3$s," +
			" which is over the advised %5$s maximum;" +
			" the focus keyword was found %4$d times." );

		max = "2.5%";

		text = i18n.sprintf( text, url, "</a>", keywordDensityPercentage, keywordCount, max );
	}

	if ( inRangeStartEndInclusive( roundedKeywordDensity, 0.5, 2.5 ) ) {
		score = 9;

		/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag,
		%3$s expands to the keyword density percentage, %4$d expands to the keyword count. */
		text = i18n.dgettext( "js-text-analysis", "The %1$skeyword density%2$s is %3$s, which is great;" +
			" the focus keyword was found %4$d times." );

		text = i18n.sprintf( text, url, "</a>", keywordDensityPercentage, keywordCount );
	}

	if ( inRangeStartInclusive( roundedKeywordDensity, 0, 0.5 ) ) {
		score = 4;

		/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag,
		%3$s expands to the keyword density percentage, %4$d expands to the keyword count. */
		text = i18n.dgettext( "js-text-analysis", "The %1$skeyword density%2$s is %3$s, which is too low;" +
			" the focus keyword was found %4$d times." );

		text = i18n.sprintf( text, url, "</a>", keywordDensityPercentage, keywordCount );
	}

	return {
		score: score,
		text: text,
		hasMarks: roundedKeywordDensity > 0,
	};
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
	var keywordCount = researcher.getResearch( "keywordCount" ).count;

	var keywordDensityResult = calculateKeywordDensityResult( keywordDensity, i18n, keywordCount );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( keywordDensityResult.score );
	assessmentResult.setText( keywordDensityResult.text );
	assessmentResult.setHasMarks( keywordDensityResult.hasMarks );

	return assessmentResult;
};

/**
 * Marks keywords in the text for the keyword density assessment.
 *
 * @param {Object} paper The paper to use for the assessment.
 *
 * @returns {Array<Mark>} A list of marks that should be applied.
 */
let getMarks = function( paper ) {
	const keywordForms = keywordCount( paper ).matches;

	return map( keywordForms, function( keywordForm ) {
		return new Mark( {
			original: keywordForm,
			marked: marker( keywordForm ),
		} );
	} );
};

module.exports = {
	identifier: "keywordDensity",
	getResult: keywordDensityAssessment,
	isApplicable: function( paper ) {
		return paper.hasText() && paper.hasKeyword() && countWords( paper.getText() ) >= 100;
	},
	getMarks: getMarks,
};
