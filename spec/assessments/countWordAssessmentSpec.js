var wordCountAssessment = require( "../../js/assessments/countWords.js" );
var Paper = require( "../../js/values/Paper.js" );

describe( "An assessor running the wordCount", function(){
	it( "Accepts an paper and ", function(){
		var mockPaper = new Paper( "hier komt een heleboel tekst in te staan" );
		var assessment = wordCountAssessment( mockPaper );
		expect( assessment.result.result ).toBe( 8 );
		expect( assessment.result.test ).toBe( "wordCount" );
	} );
} );
