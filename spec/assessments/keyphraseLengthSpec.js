var keyphraseLengthAssessment = require( "../../js/assessments/keyphraseLength.js" );
var Paper = require( "../../js/values/paper.js" );

var factory = require( "../helpers/factory.js" );
var i18n = factory.buildJed();

describe( "the keyphrase length assessment", function() {
	it( "should assess a paper without a keyword as extremely bad", function() {
		var paper = new Paper();
		var researcher = factory.buildMockResearcher( 0 );
		
		var result = keyphraseLengthAssessment( paper, researcher, i18n );

		expect( result.getScore() ).toEqual( -999 );
		expect( result.getText() ).toEqual( "No focus keyword was set for this page. " +
		   "If you do not set a focus keyword, no score can be calculated." );
	});

	it( "should assess a paper with a keyphrase that's too long as bad", function() {
		var paper = new Paper( "", { keyword: "keyword" } );
		var researcher = factory.buildMockResearcher( 11 );

		var result = keyphraseLengthAssessment( paper, researcher, i18n );

		expect( result.getScore() ).toEqual( 0 );
		expect( result.getText() ).toEqual( "Your keyphrase is over 10 words, a keyphrase should be shorter." );
	});

	it( "should not assess a paper with a keyphrase that's the correct length", function() {
		var paper = new Paper( "", { keyword: "keyword" } );
		var researcher = factory.buildMockResearcher( 10 );

		var result = keyphraseLengthAssessment( paper, researcher, i18n );

		expect( result.getScore() ).toEqual( 0 );
		expect( result.getText() ).toEqual( "" );

		researcher = factory.buildMockResearcher( 1 );
		result = keyphraseLengthAssessment( paper, researcher, i18n );

		expect( result.getScore() ).toEqual( 0 );
		expect( result.getText() ).toEqual( "" );
	});
});
