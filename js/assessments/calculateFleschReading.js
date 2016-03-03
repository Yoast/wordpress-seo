var calculateFleschReading = require( "../stringProcessing/countWords.js" );

var getScoringConfig = function( i18n ){
	return {
		scoreArray: [
		{ min: 90, score: 9, text: "{{text}}", resultText: "very easy", note: "" },
		{ min: 80, max: 89.9, score: 9, text: "{{text}}", resultText: "easy", note: "" },
		{ min: 70, max: 79.9, score: 8, text: "{{text}}", resultText: "fairly easy", note: "" },
		{ min: 60, max: 69.9, score: 8, text: "{{text}}", resultText: "ok", note: "" },
		{
			min: 50,
			max: 59.9,
			score: 6,
			text: "{{text}}",
			resultText: i18n.dgettext( "js-text-analysis", "fairly difficult" ),
			note: i18n.dgettext( "js-text-analysis", "Try to make shorter sentences to improve readability." )
		},
		{
			min: 30,
			max: 49.9,
			score: 5,
			text: "{{text}}",
			resultText: i18n.dgettext( "js-text-analysis", "difficult" ),
			note: i18n.dgettext( "js-text-analysis", "Try to make shorter sentences, using less difficult words to improve readability." )
		},
		{
			min: 0,
			max: 29.9,
			score: 4,
			text: "{{text}}",
			resultText: i18n.dgettext( "js-text-analysis", "very difficult" ),
			note: i18n.dgettext( "js-text-analysis", "Try to make shorter sentences, using less difficult words to improve readability.")
		}
	],
		replaceArray: [
		{
			name: "scoreText",
			position: "{{text}}",

			/* translators: %1$s expands to the numeric flesch reading ease score, %2$s to a link to a Yoast.com article about Flesch ease reading score, %3$s to the easyness of reading, %4$s expands to a note about the flesch reading score. */
			value: i18n.dgettext('js-text-analysis', "The copy scores %1$s in the %2$s test, which is considered %3$s to read. %4$s")
		},
		{ name: "text", position: "%1$s", sourceObj: ".result" },
		{
			name: "scoreUrl",
			position: "%2$s",
			value: "<a href='https://yoast.com/flesch-reading-ease-score/' target='new'>Flesch Reading Ease</a>"
		},
		{ name: "resultText", position: "%3$s", scoreObj: "resultText" },
		{ name: "note", position: "%4$s", scoreObj: "note" }
	]
	}
};

/**
 * The assessment that runs the FleschReading on the paper.
 *
 * @param {object} paper The paper to run this assessment on
 * @param {object} i18n The i18n-object used for parsing translations
 */
var fleschReadingAssessment = function( paper, i18n ){
	var result = calculateFleschReading( paper.getText() );
	var fleschReadingScore = getScoringConfig( i18n );
	return;
};

module.exports = fleschReadingAssessment;