var wordCountAssessment = require( "../../js/assessments/countWords.js" );
var Paper = require( "../../js/values/Paper.js" );

describe( "An assessor running the wordCount", function(){
	it( "Accepts an paper and returns a score", function(){

		var mockPaper = new Paper( "hier komt een heleboel tekst in te staan" );
		var result = wordCountAssessment( mockPaper );
		expect(result.score).toBe(-20);
		expect(result.text).toBe("The text contains 8 words. This is far too low and should be increased.");
	} );
} );
