var fleschReadingAssessment = require( "../../js/assessments/calculateFleschReading.js" );
var Paper = require( "../../js/values/Paper.js" );

var factory = require( "../helpers/factory.js" );
var i18n = factory.buildJed();

describe( "An assessment for the fleschReading", function(){
	it( "runs the fleschReading on the paper", function(){

		var paper = new Paper( "One question we get quite often in our website reviews is whether we can help people recover from the drop they noticed in their rankings or traffic. A lot of the times, this is a legitimate drop and people were actually in a bit of trouble" );

		var result = fleschReadingAssessment( paper, Factory.buildMockResearcher( 63.9 ), i18n );

		expect( result.score ).toBe( 8 );
		expect( result.text ).toBe( "The copy scores 63.9 in the <a href='https://yoast.com/flesch-reading-ease-score/' target='new'>Flesch Reading Ease</a> test, which is considered ok to read. " );

		paper = new Paper( "A piece of text to calculate scores." );

		result = fleschReadingAssessment( paper, Factory.buildMockResearcher( 78.9 ), i18n );

		expect( result.score ).toBe( 8 );
		expect( result.text ).toBe( "The copy scores 78.9 in the <a href='https://yoast.com/flesch-reading-ease-score/' target='new'>Flesch Reading Ease</a> test, which is considered fairly easy to read. " );

		paper = new Paper( "aaaaa" );

		result = fleschReadingAssessment( paper, Factory.buildMockResearcher( 36.6 ), i18n );

		expect( result.score ).toBe( 5 );
		expect( result.text ).toBe( "The copy scores 36.6 in the <a href='https://yoast.com/flesch-reading-ease-score/' target='new'>Flesch Reading Ease</a> test, which is considered difficult to read. Try to make shorter sentences, using less difficult words to improve readability." );

		result = fleschReadingAssessment( paper, Factory.buildMockResearcher( 0 ), i18n );
		expect( result.score ).toBe( 4 );
		expect( result.text ).toBe( "The copy scores 0 in the <a href='https://yoast.com/flesch-reading-ease-score/' target='new'>Flesch Reading Ease</a> test, which is considered very difficult to read. Try to make shorter sentences, using less difficult words to improve readability." );

		result = fleschReadingAssessment( paper, Factory.buildMockResearcher( 60.0 ), i18n );
		expect( result.score ).toBe( 8 );
		expect( result.text ).toBe( "The copy scores 60 in the <a href='https://yoast.com/flesch-reading-ease-score/' target='new'>Flesch Reading Ease</a> test, which is considered ok to read. " );

		result = fleschReadingAssessment( paper, Factory.buildMockResearcher( 100.0 ), i18n );
		expect( result.score ).toBe( 9 );
		expect( result.text ).toBe( "The copy scores 100 in the <a href='https://yoast.com/flesch-reading-ease-score/' target='new'>Flesch Reading Ease</a> test, which is considered very easy to read. " );

	} );
} );
