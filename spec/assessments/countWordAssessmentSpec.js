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

describe( "An assessor running the wordCount", function(){
	it( "Accepts an paper and ", function(){
		var mockPaper = new Paper( "hier komt een heleboel tekst in te staan" );
		var assessment = wordCountAssessment( mockPaper, i18n );

		expect( assessment.getScore() ).toEqual( -20 );
		expect( assessment.getText() ).toEqual ( 'The text contains 8 words. This is far too low and should be increased.' );
	} );
} );
