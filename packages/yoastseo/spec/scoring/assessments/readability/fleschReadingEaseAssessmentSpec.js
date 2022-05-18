/* eslint-disable capitalized-comments, spaced-comment */
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";
import fleschReadingAssessment from "../../../../src/scoring/assessments/readability/fleschReadingEaseAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import factory from "../../../specHelpers/factory.js";
import russianConfig from "../../../../src/languageProcessing/languages/ru/config/fleschReadingEaseScores";

describe( "An assessment for the Flesch reading ease test", function() {
	it( "returns an 'easy' score and the associated feedback text for a paper using the default config when the score is" +
		" between 80 and 90.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 80.5 ) );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 80.5 in the test," +
			" which is considered easy to read. Good job!" );
	} );

	it( "returns a 'fairly easy' score and the associated feedback text for a paper using the default config when the score is" +
		" between 70 and 80.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 70.1 ) );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 70.1 in the test," +
			" which is considered fairly easy to read. Good job!" );
	} );

	it( "returns an 'okay' score and the associated feedback text for a paper using the default config when the score is" +
		" between 60 and 70.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 69.9 ) );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 69.9 in the test," +
			" which is considered ok to read. Good job!" );
	} );

	it( "returns an 'fairly difficult' score and the associated feedback text for a paper using the default config when the score is" +
		" between 50 and 60.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 50.9 ) );

		expect( result.getScore() ).toBe( 6 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 50.9 in" +
			" the test, which is considered fairly difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try to make shorter sentences" +
			" to improve readability</a>." );
	} );

	it( "returns a 'difficult' score and the associated feedback text for a paper using the default config when the score is" +
		" between 30 and 50.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 49.1 ) );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 49.1 in the test," +
			" which is considered difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try to make shorter sentences, using less" +
			" difficult words to improve readability</a>." );
	} );

	it( "returns an 'very difficult' score and the associated feedback text for a paper using the default config when the score is" +
		" between 0 and 30.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 1.2 ) );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 1.2 in the test," +
			" which is considered very difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try to make shorter sentences, using less" +
			" difficult words to improve readability</a>." );
	} );
	it( "returns a 'very easy' score and the associated feedback text for a paper using the default config when the score is 100.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 100 ) );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 100 in the test," +
			" which is considered very easy to read. Good job!" );
	} );

	it( "returns a 'very easy' score and the associated feedback text for a paper using the default config when the score is" +
		" exactly 90.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 90 ) );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 90 in the test," +
			" which is considered very easy to read. Good job!" );
	} );

	/*it( "returns a 'very easy' score and the associated feedback text for a paper using the Russian config when the score is 100.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 100, false, false, russianConfig ) );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 100 in the test," +
			" which is considered very easy to read. Good job!" );
	} );

	it( "returns a 'very easy' score and the associated feedback text for a paper using the Russian config when the score is" +
		" exactly 80.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 80, false, false, russianConfig ) );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 80 in the test," +
			" which is considered very easy to read. Good job!" );
	} );

	it( "returns a 'very easy' score and the associated feedback text for a paper using the Russian config when the score is" +
		" between 80 and 90.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 85.6, false, false, russianConfig ) );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 85.6 in the test," +
			" which is considered very easy to read. Good job!" );
	} );

	it( "returns a 'easy' score and the associated feedback text for a paper using the Russian config when the score is" +
		" between 70 and 80.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 72.9, false, false, russianConfig ) );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 72.9 in the test," +
			" which is considered easy to read. Good job!" );
	} );*/

	it( "returns the correct score and feedback for a language that overrides the default config (Russian)", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 66.6, false, false, russianConfig ) );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 66.6 in the test," +
			" which is considered fairly easy to read. Good job!" );
	} );

	/*it( "returns an 'okay' score and the associated feedback text for a paper using the Russian config when the score is" +
		" between 50 and 60.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 55.5, false, false, russianConfig ) );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 55.5 in the test," +
			" which is considered ok to read. Good job!" );
	} );

	it( "returns a 'fairly difficult' score and the associated feedback text for a paper using the Russian config when the score is" +
		" between 40 and 50.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 40.9, false, false, russianConfig ) );

		expect( result.getScore() ).toBe( 6 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 40.9 in the test," +
			" which is considered fairly difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try to make shorter sentences to" +
			" improve readability</a>." );
	} );

	it( "returns a 'difficult' score and the associated feedback text for a paper using the Russian config when the score is" +
		" between 30 and 40.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 30, false, false, russianConfig ) );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 30 in the test," +
			" which is considered difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try to make shorter sentences, using less " +
			"difficult words to improve readability</a>." );
	} );

	it( "returns a 'very difficult' score and the associated feedback text for a paper using the Russian config when the score is" +
		" below 30.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 11.2, false, false, russianConfig ) );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 11.2 in the" +
			" test, which is considered very difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try to make shorter sentences, using " +
			"less difficult words to improve readability</a>." );
	} );
*/
	it( "returns a feedback text containing '100' for a paper with a Flesch score above 100.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( 103.0, false, false, russianConfig ) );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 100" +
			" in the test, which is considered very easy to read. Good job!" );
	} );

	it( "returns a feedback text containing '0' for a paper with a Flesch score under 0.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = fleschReadingAssessment.getResult( paper, factory.buildMockResearcher( -3.0 ) );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The copy scores 0" +
			" in the test, which is considered very difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try to make shorter" +
			" sentences, using less difficult words to improve readability</a>." );
	} );

	it( "returns true for isApplicable for an English paper with text.", function() {
		const paper = new Paper( "This is a very interesting paper.", { locale: "en_US" } );
		expect( fleschReadingAssessment.isApplicable( paper, new EnglishResearcher( paper ) ) ).toBe( true );
	} );

	it( "returns false for isApplicable for an English paper without text.", function() {
		const paper = new Paper( "", { locale: "en_US" } );
		expect( fleschReadingAssessment.isApplicable( paper, new EnglishResearcher( paper ) ) ).toBe( false );
	} );

	it( "returns false for isApplicable for an English paper with only an image.", function() {
		// eslint-disable-next-line max-len
		const paper = new Paper( "<img src=\"https://yoast.com/cdn-cgi/image/width=466%2Cheight=244%2Cfit=crop%2Cf=auto%2Conerror=redirect//app/uploads/2017/12/Focus_keyword_FI.jpg\">", { locale: "en_US" } );
		expect( fleschReadingAssessment.isApplicable( paper, new EnglishResearcher( paper ) ) ).toBe( false );
	} );

	it( "returns false for isApplicable for an English paper with only spaces.", function() {
		const paper = new Paper( "        ", { locale: "en_US" } );
		expect( fleschReadingAssessment.isApplicable( paper, new EnglishResearcher( paper ) ) ).toBe( false );
	} );

	it( "returns false for isApplicable for an Afrikaans paper with text.", function() {
		const paper = new Paper( "Hierdie is 'n interessante papier.", { locale: "af_ZA" } );
		expect( fleschReadingAssessment.isApplicable( paper, new DefaultResearcher( paper ) ) ).toBe( false );
	} );

	it( "returns false for isApplicable for an Afrikaans paper without text.", function() {
		const paper = new Paper( "", { locale: "af_ZA" } );
		expect( fleschReadingAssessment.isApplicable( paper, new DefaultResearcher( paper ) ) ).toBe( false );
	} );

} );
