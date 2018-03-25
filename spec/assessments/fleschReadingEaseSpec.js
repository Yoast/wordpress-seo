var fleschReadingAssessment = require( "../../js/assessments/readability/fleschReadingEaseAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );

var factory = require( "../helpers/factory.js" );
var i18n = factory.buildJed();

describe( "An assessment for the flesch reading", function() {
	it( "returns a 'very easy' score and the associated feedback text for a paper.", function() {
		var paper = new Paper( "This is a very interesting paper" );
		var result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 100.0 ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "The copy scores 100 in the <a href='https://yoa.st/flesch-reading' target='_blank'>Flesch Reading Ease</a> test, which is considered very easy to read. " );
	} );

	it( "returns a 'difficult' score and the associated feedback text for a paper.", function() {
		var paper = new Paper( "This is a very interesting paper" );
		var result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 82.0 ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "The copy scores 82 in the <a href='https://yoa.st/flesch-reading' target='_blank'>Flesch Reading Ease</a> test, which is considered easy to read. " );
	} );

	it( "returns a 'fairly easy' score and the associated feedback text for a paper.", function() {
		var paper = new Paper( "A piece of text to calculate scores." );
		var result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 78.9 ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "The copy scores 78.9 in the <a href='https://yoa.st/flesch-reading' target='_blank'>Flesch Reading Ease</a> test, which is considered fairly easy to read. " );
	} );

	it( "returns an 'ok' score and the associated feedback text for a paper.", function() {
		var paper = new Paper( "One question we get quite often in our website reviews is whether we can help people recover from the drop they noticed in their rankings or traffic. A lot of the times, this is a legitimate drop and people were actually in a bit of trouble" );
		var result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 63.9 ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "The copy scores 63.9 in the <a href='https://yoa.st/flesch-reading' target='_blank'>Flesch Reading Ease</a> test, which is considered ok to read. " );
	} );

	it( "returns an 'ok' score and the associated feedback text for a paper.", function() {
		var paper = new Paper( "This is a very interesting paper" );
		var result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 60.0 ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "The copy scores 60 in the <a href='https://yoa.st/flesch-reading' target='_blank'>Flesch Reading Ease</a> test, which is considered ok to read. " );
	} );

	it( "returns a 'fairly difficult' score and the associated feedback text for a paper.", function() {
		var paper = new Paper( "This is a very interesting paper" );
		var result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 55.0 ), i18n );

		expect( result.getScore() ).toBe( 6 );
		expect( result.getText() ).toBe( "The copy scores 55 in the <a href='https://yoa.st/flesch-reading' target='_blank'>Flesch Reading Ease</a> test, which is considered fairly difficult to read. Try to make shorter sentences to improve readability." );
	} );

	it( "returns a 'difficult' score and the associated feedback text for a paper.", function() {
		var paper = new Paper( "This is a very interesting paper" );
		var result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 36.6 ), i18n );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "The copy scores 36.6 in the <a href='https://yoa.st/flesch-reading' target='_blank'>Flesch Reading Ease</a> test, which is considered difficult to read. Try to make shorter sentences, using less difficult words to improve readability." );
	} );

	it( "returns a 'very difficult' score and the associated feedback text for a paper.", function() {
		var paper = new Paper( "This is a very interesting paper" );
		var result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 0 ), i18n );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "The copy scores 0 in the <a href='https://yoa.st/flesch-reading' target='_blank'>Flesch Reading Ease</a> test, which is considered very difficult to read. Try to make shorter sentences, using less difficult words to improve readability." );
	} );

	it( "returns a feedback text containing '100' for a paper with a flesch score above 100.", function() {
		var paper = new Paper( "This is a very interesting paper" );
		var result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 103.0 ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "The copy scores 100 in the <a href='https://yoa.st/flesch-reading' target='_blank'>Flesch Reading Ease</a> test, which is considered very easy to read. " );
	} );

	it( "returns a feedback text containing '0' for a paper with a flesch score under 0.", function() {
		var paper = new Paper( "This is a very interesting paper" );
		var result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( -3.0 ), i18n );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "The copy scores 0 in the <a href='https://yoa.st/flesch-reading' target='_blank'>Flesch Reading Ease</a> test, which is considered very difficult to read. Try to make shorter sentences, using less difficult words to improve readability." );
	} );

	it( "returns true for isApplicable for an English paper with text.", function() {
		var paper = new Paper( "This is a very interesting paper.", { locale: "en_EN" } );
		expect( fleschReadingAssessment.isApplicable( paper ) ).toBe( true );
	} );

	it( "returns false for isApplicable for an Afrikaans paper with text.", function() {
		var paper = new Paper( "Hierdie is 'n interessante papier.", { locale: "af_ZA" } );
		expect( fleschReadingAssessment.isApplicable( paper ) ).toBe( false );
	} );

	it( "returns false for isApplicable for an English paper without text.", function() {
		var paper = new Paper( "", { locale: "en_EN" } );
		expect( fleschReadingAssessment.isApplicable( paper ) ).toBe( false );
	} );

	it( "returns false for isApplicable for an Afrikaans paper without text.", function() {
		var paper = new Paper( "", { locale: "af_ZA" } );
		expect( fleschReadingAssessment.isApplicable( paper ) ).toBe( false );
	} );
} );
