var calculateFleschReading = require( "../analyses/calculateFleschReading.js" );
var AssessmentResult = require( "../values/AssessmentResult.js" );
var inRange = require( "lodash/number/inRange" );

/**
 * Function passed to the assessmentResultCalculator for replacing the resultText.
 * @param { object } scoreEntry the entry of the scoreArray with the currentScore
 * @returns {string} the textString to use for replacements
 */
var getResultText = function( scoreEntry ) {
	return scoreEntry.resultText;
};

/**
 * Returns the scoring configuration object with scoreArray and replacements
 * @param {object} i18n The i18n object used for translating strings
 * @returns {object} object with scoreArray and replacements
 */
var getScoringConfiguration = function( i18n ) {

	return {
		scoreArray: [
			{
				min: 90,
				score: 9,
				text: replaceableText,
				resultText:  i18n.dgettext( "js-text-analysis", "very easy" )
			},
			{
				range: [ 80, 90 ],
				score: 9,
				text: replaceableText,
				resultText:  i18n.dgettext( "js-text-analysis", "easy" )
			},
			{
				range: [ 70, 80 ],
				score: 8,
				text: replaceableText,
				resultText:  i18n.dgettext( "js-text-analysis", "fairly easy" )
			},
			{
				range: [ 60, 70 ],
				score: 8,
				text: replaceableText,
				resultText:  i18n.dgettext( "js-text-analysis", "ok" )
			},
			{
				range: [ 50, 60 ],
				score: 6,
				text: replaceableText,
				resultText: i18n.dgettext( "js-text-analysis", "fairly difficult" ),
				note: i18n.dgettext( "js-text-analysis", "Try to make shorter sentences to improve readability." )
			},
			{
				range: [ 30, 50 ],
				score: 5,
				text: replaceableText,
				resultText: i18n.dgettext( "js-text-analysis", "difficult" ),
				note: i18n.dgettext( "js-text-analysis", "Try to make shorter sentences, using less difficult words to improve readability." )
			},
			{
				range: [ 0, 30 ],
				score: 4,
				text: replaceableText,
				resultText: i18n.dgettext( "js-text-analysis", "very difficult" ),
				note: i18n.dgettext( "js-text-analysis", "Try to make shorter sentences, using less difficult words to improve readability." )
			}
		],
		replacements: {
			"%1$s": "%%result%%",
			"%2$s": "<a href='https://yoast.com/flesch-reading-ease-score/' target='new'>Flesch Reading Ease</a>",
			"%3$s": getResultText,
			"%4$s": "%%note%%"
		}
	};
};

/**
 * The assessment that runs the FleschReading on the paper.
 *
 * @param {object} paper The paper to run this assessment on
 * @param {object} i18n The i18n-object used for parsing translations
 */
var fleschReadingAssessment = function( paper, i18n ) {
	var fleschReadingScore = calculateFleschReading( paper.getText() );
	var score = 0;

	/* translators: %1$s expands to the numeric flesch reading ease score, %2$s to a link to a Yoast.com article about Flesch ease reading score,
	 %3$s to the easyness of reading, %4$s expands to a note about the flesch reading score. */
	var text = i18n.dgettext( "js-text-analysis", "The copy scores %1$s in the %2$s test, which is considered %3$s to read. %4$s" );
	var url = "<a href='https://yoast.com/flesch-reading-ease-score/' target='new'>Flesch Reading Ease</a>";
	var note = "";
	var resultText;

	// scores must be between 0 and 100;
	if ( fleschReadingScore < 0 ) {
		fleschReadingScore = 0;
	}
	if ( fleschReadingScore > 100 ) {
		fleschReadingScore = 100;
	}

	if ( fleschReadingScore > 90 ) {
		score = 9;
		resultText = i18n.dgettext( "js-text-analysis", "very easy" );
	}

	if ( inRange( fleschReadingScore, 80, 90 ) ){
		score = 9;
		resultText =  i18n.dgettext( "js-text-analysis", "easy" );
	}

	if ( inRange( fleschReadingScore, 70, 80 ) ){
		score = 8;
		resultText =  i18n.dgettext( "js-text-analysis", "fairly easy" );
	}

	if ( inRange( fleschReadingScore, 60, 70 ) ){
		score = 8;
		resultText =  i18n.dgettext( "js-text-analysis", "ok" );
	}

	if ( inRange( fleschReadingScore, 50, 60 ) ){
		score = 6;
		resultText =  i18n.dgettext( "js-text-analysis", "fairly difficult" );
		note = i18n.dgettext( "js-text-analysis", "Try to make shorter sentences to improve readability." )
	}

	if ( inRange( fleschReadingScore, 30, 50 ) ){
		score = 5;
		resultText =  i18n.dgettext( "js-text-analysis", "difficult" );
		note = i18n.dgettext( "js-text-analysis", "Try to make shorter sentences, using less difficult words to improve readability." )
	}

	if ( fleschReadingScore < 30 ) {
		score = 4;
		resultText =  i18n.dgettext( "js-text-analysis", "very difficult" );
		note = i18n.dgettext( "js-text-analysis", "Try to make shorter sentences, using less difficult words to improve readability." )
	}

	text = i18n.sprintf( text, fleschReadingScore, url, resultText, note );

	return new AssessmentResult( score, text );
};

module.exports = fleschReadingAssessment;
