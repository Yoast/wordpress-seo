import fleschReadingAssessment from "../../src/scoring/assessments/readability/fleschReadingEaseAssessment.js";
import Paper from "../../src/values/Paper.js";
import factory from "../specHelpers/factory.js";
const i18n = factory.buildJed();
import EnglishResearcher from "../../src/languageProcessing/languages/en/Researcher";
import DutchResearcher from "../../src/languageProcessing/languages/nl/Researcher";
import RussianResearcher from "../../src/languageProcessing/languages/ru/Researcher";

describe( "An assessment for the Flesch reading", function() {
	it( "returns a 'very easy' score and the associated feedback text for an English paper.", function() {
		const paper = new Paper( "This is a good paper. It has an easy text." );
		const result = fleschReadingAssessment.getResult( paper, new EnglishResearcher( paper ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 100 in the test," +
			" which is considered very easy to read. Good job!" );
	} );

	it( "returns a 'very easy' score and the associated feedback text for a Dutch paper.", function() {
		const paper = new Paper( "Dit is een kat. Hij heeft een staart." );
		const result = fleschReadingAssessment.getResult( paper, new DutchResearcher( paper ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 100 in the test," +
			" which is considered very easy to read. Good job!" );
	} );

	it( "returns a 'very easy' score and the associated feedback text for a Russian paper.", function() {
		const paper = new Paper( "Это кот. У него есть хвост." );
		const result = fleschReadingAssessment.getResult( paper, new RussianResearcher( paper ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 100 in the test," +
			" which is considered very easy to read. Good job!" );
	} );

	it( "returns a 'very easy' score and the associated feedback text for a Russian paper when the score is between 80 and 90.", function() {
		const paper = new Paper( "Это простой текст. Я легко могу это прочитать." );
		const result = fleschReadingAssessment.getResult( paper, new RussianResearcher( paper ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 88.9 in the test," +
			" which is considered very easy to read. Good job!" );
	} );

	it( "returns an 'easy' score and the associated feedback text for a Russian paper when the score is between 70 and 80.", function() {
		const paper = new Paper( "Это красиво написанный и простой текст. Я легко могу это прочитать." );
		const result = fleschReadingAssessment.getResult( paper, new RussianResearcher( paper ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 74 in the test," +
			" which is considered easy to read. Good job!" );
	} );

	it( "returns an 'fairly easy' score and the associated feedback text for a Russian paper when the score is between 60 and 70.", function() {
		const paper = new Paper( "Это красиво написанный и простой текст. Большинство людей могут легко ее прочитать." );
		const result = fleschReadingAssessment.getResult( paper, new RussianResearcher( paper ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 63.8 in the test," +
			" which is considered fairly easy to read. Good job!" );
	} );

	it( "returns an 'okay' score and the associated feedback text for a Russian paper when the score is between 50 and 60.", function() {
		const paper = new Paper( "Это простой текст, но он содержит необычную лексику. Некоторым это может показаться трудным." );
		const result = fleschReadingAssessment.getResult( paper, new RussianResearcher( paper ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 50.4 in the test," +
			" which is considered ok to read. Good job!" );
	} );

	it( "returns an 'fairly difficult' score and the associated feedback text for a Russian paper when the score is between 40 and 50.", function() {
		const paper = new Paper( "Это относительно простой текст, но он также содержит причудливую лексику. Некоторым это может показаться" +
			" трудным." );
		const result = fleschReadingAssessment.getResult( paper, new RussianResearcher( paper ), i18n );

		expect( result.getScore() ).toBe( 6 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 40.8 in the test," +
			" which is considered fairly difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try to make shorter sentences to" +
			" improve readability</a>." );
	} );

	it( "returns an 'difficult' score and the associated feedback text for a Russian paper when the score is between 30 and 40.", function() {
		const paper = new Paper( "Это относительно простой текст, но он содержит необычную лексику. Некоторым это может показаться трудным." );
		const result = fleschReadingAssessment.getResult( paper, new RussianResearcher( paper ), i18n );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 38.9 in the test," +
			" which is considered difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try to make shorter sentences, using less" +
			" difficult words to improve readability</a>." );
	} );

	it( "returns a 'very difficult' score and the associated feedback text for a Russian paper when the score is below 30.", function() {
		const paper = new Paper( "В этом интересном произведении написано так много чрезвычайно сложной и чрезвычайно технической лексики. В этом" +
			" интересном произведении написано так много чрезвычайно сложной и чрезвычайно технической лексики." );
		const result = fleschReadingAssessment.getResult( paper, new RussianResearcher( paper ), i18n );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 18.9 in the test," +
			" which is considered very difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try to make shorter sentences, using less" +
			" difficult words to improve readability</a>." );
	} );

	it( "returns a 'easy' score and the associated feedback text for an English paper when the score is between 80 and 90.", function() {
		const paper = new Paper( "This is a pretty easy text. But it could be a bit easier." );
		const result = fleschReadingAssessment.getResult( paper, new EnglishResearcher( paper ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 89.6 in the test," +
			" which is considered easy to read. Good job!" );
	} );

	it( "returns a 'fairly easy' score and the associated feedback text for an English paper when the score is between 70 and 80.", function() {
		const paper = new Paper( "This is a fairly easy text. But some people may find it too complicated." );
		const result = fleschReadingAssessment.getResult( paper, new EnglishResearcher( paper ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 78.9 in the test," +
			" which is considered fairly easy to read. Good job!" );
	} );

	it( "returns a 'okay' score and the associated feedback text for an English paper when the score is between 60 and 70.", function() {
		const paper = new Paper( "I think this is an okay text. But it contains fancy vocabulary which is annoying." );
		const result = fleschReadingAssessment.getResult( paper, new EnglishResearcher( paper ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 63.9 in the test," +
			" which is considered ok to read. Good job!" );
	} );

	it( "returns a 'fairly difficult' score and the associated feedback text for an English paper when the score is between 50 and 60.", function() {
		const paper = new Paper( "This is a fairly difficult text. It contains fancy vocabulary and people don't like that." );
		const result = fleschReadingAssessment.getResult( paper, new EnglishResearcher( paper ), i18n );

		expect( result.getScore() ).toBe( 6 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 58.2 in the test," +
			" which is considered fairly difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try to make shorter sentences to" +
			" improve readability</a>." );
	} );

	it( "returns a 'difficult' score and the associated feedback text for an English paper when the score is between 30 and 50.", function() {
		const paper = new Paper( "This is an extremely interesting and valuable paper. It took me many years of intellectual effort to write such" +
			" an eloquent text." );
		const result = fleschReadingAssessment.getResult( paper, new EnglishResearcher( paper ), i18n );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 49.5 in the test," +
			" which is considered difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try to make shorter sentences, using less" +
			" difficult words to improve readability</a>." );
	} );

	it( "returns a 'very difficult' score and the associated feedback text for an English paper when the score is between 0 and 30.", function() {
		const paper = new Paper( "This is a very complicated piece of complicated writing. It's full of complicated vocabulary and requires" +
			" enormous effort to be understood." );
		const result = fleschReadingAssessment.getResult( paper, new EnglishResearcher( paper ), i18n );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 22.9 in the test," +
			" which is considered very difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try to make shorter sentences, using less" +
			" difficult words to improve readability</a>." );
	} );


	/*
	it( "returns a feedback text containing '100' for a paper with a flesch score above 100.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult( paper, factory.buildMockResearcher( 103.0 ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 100 in the test, which is considered very easy to read. Good job!" );
	} );

	it( "returns a feedback text containing '0' for a paper with a flesch score under 0.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult( paper, factory.buildMockResearcher( -3.0 ), i18n );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 0 in the test, which is considered very difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try to make shorter sentences, using less difficult words to improve readability</a>." );
	} );

	it( "returns a null result for the assessment for an Afrikaans paper with text.", function() {
		const paper = new Paper( "Hierdie is 'n interessante papier.", { locale: "af_ZA" } );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult( paper, factory.buildMockResearcher( 0 ), i18n );
		expect( result ).toBe( null );
	} );

	it( "returns true for isApplicable for an English paper with text.", function() {
		const paper = new Paper( "This is a very interesting paper.", { locale: "en_EN" } );
		expect( new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).isApplicable( paper ) ).toBe( true );
	} );

	it( "returns false for isApplicable for an Afrikaans paper with text.", function() {
		const paper = new Paper( "Hierdie is 'n interessante papier.", { locale: "af_ZA" } );
		expect( new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).isApplicable( paper ) ).toBe( false );
	} );

	it( "returns false for isApplicable for an Afrikaans paper without text.", function() {
		const paper = new Paper( "", { locale: "af_ZA" } );
		expect( new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).isApplicable( paper ) ).toBe( false );
	} );*/
} );
