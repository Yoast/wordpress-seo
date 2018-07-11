var keyphraseLengthAssessment = require( "../../js/assessments/seo/keyphraseLengthAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );

var factory = require( "../helpers/factory.js" );
var i18n = factory.buildJed();

describe( "the keyphrase length assessment", function() {
	it( "should assess a paper without a keyword as extremely bad", function() {
		var paper = new Paper();
		var researcher = factory.buildMockResearcher( 0 );

		var result = new keyphraseLengthAssessment().getResult( paper, researcher, i18n );

		expect( result.getScore() ).toEqual( -999 );
		expect( result.getText() ).toEqual( "No <a href='https://yoa.st/2pdd' target='_blank'>focus keyword</a> was set for this page. " +
		   "If you do not set a focus keyword, no score can be calculated." );
	} );

	it( "should assess a paper with a keyphrase that's too long as bad", function() {
		var paper = new Paper( "", { keyword: "keyword" } );
		var researcher = factory.buildMockResearcher( 11 );

		var result = new keyphraseLengthAssessment().getResult( paper, researcher, i18n );

		expect( result.getScore() ).toEqual( 0 );
		expect( result.getText() ).toEqual( "The <a href='https://yoa.st/2pd' target='_blank'>keyphrase</a> is over 10 words, a keyphrase should be shorter." );
	} );

	it( "should not assess a paper with a keyphrase that's the correct length", function() {
		var paper = new Paper( "", { keyword: "keyword" } );
		var researcher = factory.buildMockResearcher( 10 );

		var result = new keyphraseLengthAssessment().getResult( paper, researcher, i18n );

		expect( result.getScore() ).toEqual( 0 );
		expect( result.getText() ).toEqual( "" );

		researcher = factory.buildMockResearcher( 1 );
		result = new keyphraseLengthAssessment().getResult( paper, researcher, i18n );

		expect( result.getScore() ).toEqual( 0 );
		expect( result.getText() ).toEqual( "" );
	} );
} );
