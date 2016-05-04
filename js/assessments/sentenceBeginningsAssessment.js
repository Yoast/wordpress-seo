 var repeatedSentenceBeginnings =
	
	

	
/**
 * Calculates sentence beginnings score
 * @param {array} sentences The array containing sentences.
 * @param {object} i18n The object used for translations.
 * @returns {object} Object containing score and text.
 */

// var calculateSentenceLengthResult = function( sentences, i18n ) {

//	var tooLong = countTooLongSentences( sentences, recommendedValue );
//	var percentage = ( tooLong / sentences.length ) * 100;

//	var score = calculateTooLongSentences( percentage );

	if ( score < 7 ) {
		return{
			score: score,

			// translators: %1$s expands to number of consecutive sentences starting with the same word.
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "%1$s consecutive sentences start with the same word. " +
				"Try to mix things up!" ), count )
		};
	}
 return {};
};



/**
 * Scores the repetition sentence beginnings in consecutive sentences.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessmentresult
 */

var sentenceBeginningsAssessment = function( paper, researcher, i18n ) {
	var sentenceBeginnings = researcher.getResearch( "getSentenceBeginnings" );
	//var sentenceResult = calculateSentenceLengthResult( sentenceCount, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( sentenceResult.score );
	assessmentResult.setText( sentenceResult.text );

	return assessmentResult;
};

module.exports = {
	getResult: sentenceBeginningsAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};

