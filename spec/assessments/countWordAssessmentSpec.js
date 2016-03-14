var Researcher = require("../../js/researcher.js");
var wordCountAssessment = require( "../../js/assessments/countWords.js" );
var Paper = require( "../../js/values/Paper.js" );

var Jed = require( "jed" );

var constructi18n = function() {
	var defaultTranslations = {
		"domain": "js-text-analysis",
		"locale_data": {
			"js-text-analysis": {
				"": {}
			}
		}
	};
	return new Jed( defaultTranslations );
};

var i18n = constructi18n();

/**
 * This method repeats a string and returns a new string based on the string and the amount of repetitions.
 * @param string
 * @param times
 * @returns {string}
 */
var repeatString = function(string, times) {
	var resultString = "";

	for (var i = 0; i < times; i++) {
		resultString += string;
	}

	return resultString;
};

describe( "A word count assessment", function(){
	it( "assesses a single word", function(){
		var mockPaper = new Paper( "sample" );
		var researcher = new Researcher( mockPaper );
		var assessment = wordCountAssessment( mockPaper, researcher, i18n );

		expect( assessment.getScore() ).toEqual( -20 );
		expect( assessment.getText() ).toEqual ( 'The text contains 1 word, this is far too low and should be increased.' );
	} );

	it( "assesses a low word count", function(){
		var mockPaper = new Paper( "These are just five words" );
		var researcher = new Researcher( mockPaper );
		var assessment = wordCountAssessment( mockPaper, researcher, i18n );

		expect( assessment.getScore() ).toEqual( -20 );
		expect( assessment.getText() ).toEqual ( 'The text contains 5 words, this is far too low and should be increased.' );
	} );

	it( "assesses a medium word count", function(){
		var mockPaper = new Paper( repeatString("Sample ", 150) );
		var researcher = new Researcher( mockPaper );
		var assessment = wordCountAssessment( mockPaper, researcher, i18n );

		expect( assessment.getScore() ).toEqual( -10 );
	} );

	it( "assesses a slightly higher than medium word count", function(){
		var mockPaper = new Paper( repeatString("Sample ", 225) );
		var researcher = new Researcher( mockPaper );
		var assessment = wordCountAssessment( mockPaper, researcher, i18n );

		expect( assessment.getScore() ).toEqual( 5 );
	} );

	it( "assesses an almost at the recommended amount, word count", function(){
		var mockPaper = new Paper( repeatString("Sample ", 275) );
		var researcher = new Researcher( mockPaper );
		var assessment = wordCountAssessment( mockPaper, researcher, i18n );

		expect( assessment.getScore() ).toEqual( 7 );
	} );

	it( "assesses high word count", function(){
		var mockPaper = new Paper( repeatString("Sample ", 325) );
		var researcher = new Researcher( mockPaper );
		var assessment = wordCountAssessment( mockPaper, researcher, i18n );

		expect( assessment.getScore() ).toEqual( 9 );
	} );
} );
