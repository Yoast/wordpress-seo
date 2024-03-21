import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher";
import TransitionWordsAssessment from "../../../../src/scoring/assessments/readability/TransitionWordsAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../../src/helpers/factory.js";
import Mark from "../../../../src/values/Mark.js";

const shortTextJapanese = "熱".repeat( 399 );
const longTextJapanese = "熱".repeat( 400 );

describe( "An assessment for transition word percentage", function() {
	it( "returns the score for 0% of the sentences with transition words", function() {
		const mockPaper = new Paper();
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 10,
			transitionWordSentences: 0 } ) );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
			"None of the sentences contain transition words. <a href='https://yoa.st/35a' target='_blank'>Use some</a>." );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for a paper with text but no sentences (e.g. only images)", function() {
		const mockPaper = new Paper();
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 0,
			transitionWordSentences: 0 } ) );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
			"None of the sentences contain transition words. <a href='https://yoa.st/35a' target='_blank'>Use some</a>." );
		expect( assessment.hasMarks() ).toBe( false );
	} );

	it( "returns the score for 10.0% of the sentences with transition words", function() {
		const mockPaper = new Paper();
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 10,
			transitionWordSentences: 1 } ) );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
			"Only 10% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' " +
			"target='_blank'>Use more of them</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns the score for 20.0% of the sentences with transition words", function() {
		const mockPaper = new Paper();
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 5,
			transitionWordSentences: 1 } ) );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
			"Only 20% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' " +
			"target='_blank'>Use more of them</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns the score for 25.0% of the sentences with transition words", function() {
		const mockPaper = new Paper();
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 4,
			transitionWordSentences: 1 } ) );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: " +
			"Only 25% of the sentences contain transition words, which is not enough. <a href='https://yoa.st/35a' " +
			"target='_blank'>Use more of them</a>." );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns the score for 35.0% of the sentences with transition words", function() {
		const mockPaper = new Paper();
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 20,
			transitionWordSentences: 7 } ) );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns the score for 40% sentences with transition words", function() {
		const mockPaper = new Paper();
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 10,
			transitionWordSentences: 4 } ) );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 47% sentences with transition words", function() {
		const mockPaper = new Paper();
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 100,
			transitionWordSentences: 47 } ) );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 66.7% of the sentences with transition words", function() {
		const mockPaper = new Paper();
		const assessment = new TransitionWordsAssessment().getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 3,
			transitionWordSentences: 2 } ) );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "should match transition word in image caption", function() {
		const paper = new Paper( "<p><img class='size-medium wp-image-33' src='http://basic.wordpress.test/wp-content/uploads/2021/08/" +
			"cat-3957861_1280-211x300.jpeg' alt='a different cat with toy' width='211' height='300'></img> " +
			"However, a cat with the toy looks happier. She is given raw food. Seniors don't like it.<br></br>\n" +
			"</p>" );
		const researcher = new EnglishResearcher( paper );
		const result = new TransitionWordsAssessment().getResult( paper, researcher );

		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34z' target='_blank'>Transition words</a>: Well done!" );
	} );

	it( "is not applicable for empty papers", function() {
		const mockPaper = new Paper();
		const assessment = new TransitionWordsAssessment().isApplicable( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( assessment ).toBe( false );
	} );

	it( "is not applicable when the text is less than 200 words", function() {
		const mockPaper = new Paper( "Lorem ipsum dolor sit amet, ne sed agam oblique alterum. Eos percipit singulis no. No scripta graecis cum. " +
			"Ut vim eius porro labore. Id quem civibus sit. Sed no primis urbanitas, aperiri laboramus voluptatibus ei per. Esse consul possim " +
			"duo eu, eu duo natum ferri libris. Tritani percipit interpretaris ne ius. Mel prima definitionem eu, partem labores vim at. " +
			"Prompta vivendum usu te. Indoctum philosophia definitiones usu ad, cum quodsi alienum et. " );
		const assessment = new TransitionWordsAssessment().isApplicable( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( assessment ).toBe( false );
	} );

	it( "is not applicable when the text is more than 200 words but the text is inside an element we want to exclude from the analysis", function() {
		const mockPaper = new Paper( "<blockquote>Lorem ipsum dolor sit amet, ne sed agam oblique alterum. Eos percipit singulis no." +
			" No scripta graecis cum. Ut vim eius porro labore. Id quem civibus sit. Sed no primis urbanitas, aperiri laboramus voluptatibus" +
			" ei per. Esse consul possim duo eu, eu duo natum ferri libris. Tritani percipit interpretaris ne ius. Mel prima definitionem eu," +
			" partem labores vim at. Prompta vivendum usu te. Indoctum philosophia definitiones usu ad, cum quodsi alienum et. " +
			"Sumo civibus appareat est ea, in iriure euismod dolores mel. Mea scripta senserit maluisset ei." +
			" Vel id mollis delicata constituam, laoreet scriptorem his cu, " +
			"facilis accusam quaerendum nam in. Adversarium philosophia deterruisset duo at, augue postulant ut eos, usu ne iuvaret docendi. " +
			"Iudicabit eloquentiam usu no. Vide volumus pri ne. Eos ignota timeam ponderum ei, an postea principes prodesset sit, " +
			"purto blandit offendit pro an. Ei vim ludus veniam mnesarchum. Ne modus consul dolorem his, solum alienum eu nec. " +
			"Mea legendos deserunt quaerendum te, fierent fabellas eu per. Ei sea accumsan fabellas signiferumque. Veri ludus aperiri his at, " +
			"meis dicant impedit an qui. Est error offendit ex, at affert mediocrem interpretaris nam. Percipit persecuti et mel, persecuti " +
			"inciderint signiferumque cu usu, an sit nemore nusquam. Brute iracundia sea ei, ad esse dictas aliquam est, prompta ceteros " +
			"aliquando ne vix. Fabulas voluptua eu vel. Ceteros euripidis has cu. Pro ea esse ignota perfecto, ius noluisse liberavisse ei. " +
			"Has possim mediocritatem in. Paulo alienum accusamus pro cu, magna labore sit ad. Sumo paulo sea in, cum te latine " +
			"labores inciderint.</blockquote>" );
		const assessment = new TransitionWordsAssessment().isApplicable( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( assessment ).toBe( false );
	} );

	it( "should not be applicable if the text has more than 200 words, but part of the words are shortcodes", function() {
		const mockPaper = new Paper( "Text " + "text ".repeat( 198 ) + "[shortcode]".repeat( 2 ), { shortcodes: [ "shortcode" ] } );
		const assessment = new TransitionWordsAssessment().isApplicable( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable when used with a supported researcher, e.g. the English researcher", function() {
		const mockPaper = new Paper( "Lorem ipsum dolor sit amet, ne sed agam oblique alterum. Eos percipit singulis no. No scripta graecis cum. " +
			"Ut vim eius porro labore. Id quem civibus sit. Sed no primis urbanitas, aperiri laboramus voluptatibus ei per. Esse consul possim " +
			"duo eu, eu duo natum ferri libris. Tritani percipit interpretaris ne ius. Mel prima definitionem eu, partem labores vim at. " +
			"Prompta vivendum usu te. Indoctum philosophia definitiones usu ad, cum quodsi alienum et. Sumo civibus appareat est ea, " +
			"in iriure euismod dolores mel. Mea scripta senserit maluisset ei. Vel id mollis delicata constituam, laoreet scriptorem his cu, " +
			"facilis accusam quaerendum nam in. Adversarium philosophia deterruisset duo at, augue postulant ut eos, usu ne iuvaret docendi. " +
			"Iudicabit eloquentiam usu no. Vide volumus pri ne. Eos ignota timeam ponderum ei, an postea principes prodesset sit, " +
			"purto blandit offendit pro an. Ei vim ludus veniam mnesarchum. Ne modus consul dolorem his, solum alienum eu nec. " +
			"Mea legendos deserunt quaerendum te, fierent fabellas eu per. Ei sea accumsan fabellas signiferumque. Veri ludus aperiri his at, " +
			"meis dicant impedit an qui. Est error offendit ex, at affert mediocrem interpretaris nam. Percipit persecuti et mel, persecuti " +
			"inciderint signiferumque cu usu, an sit nemore nusquam. Brute iracundia sea ei, ad esse dictas aliquam est, prompta ceteros " +
			"aliquando ne vix. Fabulas voluptua eu vel. Ceteros euripidis has cu. Pro ea esse ignota perfecto, ius noluisse liberavisse ei. " +
			"Has possim mediocritatem in. Paulo alienum accusamus pro cu, magna labore sit ad. Sumo paulo sea in, cum te latine " +
			"labores inciderint.", { locale: "en_US" } );
		const assessment = new TransitionWordsAssessment().isApplicable( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable when used with a non-supported researcher, e.g. the default researcher", function() {
		const mockPaper = new Paper( "This is a string", { locale: "xx_YY" } );
		const assessment = new TransitionWordsAssessment().isApplicable( mockPaper, new DefaultResearcher( mockPaper ) );
		expect( assessment ).toBe( false );
	} );

	it( "is not applicable when the text is less than 400 characters in Japanese", function() {
		const mockPaper = new Paper( shortTextJapanese );
		const assessment = new TransitionWordsAssessment().isApplicable( mockPaper, new JapaneseResearcher( mockPaper ) );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable when the text is 400 characters or longer in Japanese", function() {
		const mockPaper = new Paper( longTextJapanese );
		const assessment = new TransitionWordsAssessment().isApplicable( mockPaper, new JapaneseResearcher( mockPaper ) );
		expect( assessment ).toBe( true );
	} );
} );

describe( "A test for marking sentences containing a transition word", function() {
	it( "returns markers for sentences containing transition words", function() {
		const paper = new Paper( "This sentence is marked, because it contains a transition word." );
		const transitionWords = Factory.buildMockResearcher( { sentenceResults: [ { sentence: "This sentence is marked, " +
					"because it contains a transition word.", transitionWords: [ "because" ] } ] } );
		const expected = [
			new Mark( { original: "This sentence is marked, because it contains a transition word.", marked: "<yoastmark " +
					"class='yoast-text-mark'>This sentence is marked, because it contains a transition word.</yoastmark>" } ),
		];
		expect( new TransitionWordsAssessment().getMarks( paper, transitionWords ) ).toEqual( expected );
	} );

	it( "returns no markers if no sentences contain a transition word", function() {
		const paper = new Paper( "This sentence is not marked." );
		const transitionWords = Factory.buildMockResearcher( { sentenceResults: [ ] } );
		const expected = [];
		expect( new TransitionWordsAssessment().getMarks( paper, transitionWords ) ).toEqual( expected );
	} );

	it( "returns markers for an image caption containing transition words", function() {
		const paper = new Paper( "<p><img class='size-medium wp-image-33' src='http://basic.wordpress.test/wp-content/uploads/2021/08/" +
			"cat-3957861_1280-211x300.jpeg' alt='a different cat with toy' width='211' height='300'></img> " +
			"However, a cat with the toy looks happier. She is given raw food. Seniors don't like it.<br></br>\n" +
			"</p>" );
		const researcher = new EnglishResearcher( paper );
		const expected = [
			new Mark( {
				original: "However, a cat with the toy looks happier.",
				marked: "<yoastmark class='yoast-text-mark'>However, a cat with the toy looks happier.</yoastmark>" } ),
		];
		expect( new TransitionWordsAssessment().getMarks( paper, researcher ) ).toEqual( expected );
	} );
} );
