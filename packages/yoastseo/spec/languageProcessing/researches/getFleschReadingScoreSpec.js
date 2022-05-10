import fleschFunction from "../../../src/languageProcessing/researches/getFleschReadingScore";
import Paper from "../../../src/values/Paper.js";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";

describe( "a test to calculate the fleschReading score", function() {
	it( "returns a score", function() {
		let mockPaper = new Paper( "A piece of text to calculate scores." );
		const researcher = new EnglishResearcher( mockPaper );
		expect( fleschFunction( mockPaper, researcher ) ).toBe( 91 );

		mockPaper = new Paper( "One question we get quite often in our website reviews is whether we can help people recover " +
			"from the drop they noticed in their rankings or traffic. A lot of the times, this is a legitimate drop " +
			"and people were actually in a bit of trouble" );
		expect( fleschFunction( mockPaper, researcher ) ).toBe( 63.9 );

		mockPaper = new Paper( "" );
		expect( fleschFunction( mockPaper, researcher ) ).toBe( 0 );
	} );
} );
describe( "A test to check the filter of digits", function() {
	const mockPaper = new Paper( "A text string to test with digits" );
	const mockPaperWithDigits = new Paper( "A 456 text string to test with 123 digits" );
	it( "should return the same for a text string with only extra digits", function() {
		expect( fleschFunction( mockPaper, new EnglishResearcher( mockPaper ) ) )
			.toBe( fleschFunction( mockPaperWithDigits, new EnglishResearcher( mockPaperWithDigits ) ) );
	} );
} );

/*
describe( "A test that uses the Dutch Flesch Reading", function() {
	it( "returns a score", function() {
		const mockPaper = new Paper( "Een kort stukje tekst in het Nederlands om te testen.", { locale: "nl_NL" } );
		expect( fleschFunction( mockPaper, new DutchResearcher( mockPaper ) ) ).toBe( 89.7 );
	} );

	it( "returns a score", function() {
		const mockPaper = new Paper( "Dit is wat meer tekst om te testen. Het bestaat uit meerdere zinnen waardoor we een " +
			"andere score moeten krijgen.", { locale: "nl_NL" } );
		expect( fleschFunction( mockPaper, new DutchResearcher( mockPaper ) ) ).toBe( 78.2 );
	} );
} );

describe( "A test that uses the German Flesch Reading", function() {
	it( "returns a score", function() {
		const mockPaper = new Paper( "Zero Hour ist eine nach kanadischer Idee in Großbritannien produzierte dokumentarische " +
			"Fernsehreihe die auf dem History Channel in Kanada.", { locale: "de_DE" } );
		expect( fleschFunction( mockPaper, new GermanResearcher( mockPaper ) ) ).toBe( 25.5 );
	} );

	it( "returns a score", function() {
		const mockPaper = new Paper( "Unterhalb der Szene, die aus plastischen Figuren besteht, erkennt man wieder Fruchtornament.",
			{ locale: "de_DE" } );
		expect( fleschFunction( mockPaper, new GermanResearcher( mockPaper ) ) ).toBe( 46.1 );
	} );
} );

describe( "A test that uses the Italian Flesch Reading", function() {
	it( "returns a score", function() {
		const mockPaper = new Paper( "Che bella cosa e 'una sola giornata, n'aria serena doppo na tempesta.", { locale: "it_IT" } );
		expect( fleschFunction( mockPaper, new ItalianResearcher( mockPaper ) ) ).toBe( 81.4 );
	} );
} );

describe( "A test that uses the Russian Flesch Reading", function() {
	it( "returns a score", function() {
		const mockPaper = new Paper( "Это бесконечно длинное предложение на русском языке, в нем чрезвычайно много довольно длинных слов, " +
			"и понять его очень сложно.", { locale: "ru_RU" } );
		expect( fleschFunction( mockPaper, new RussianResearcher( mockPaper ) ) ).toBe( 49.3 );
	} );
} );

describe( "A test that uses the Spanish Flesch Reading", function() {
	it( "returns a score", function() {
		const mockPaper = new Paper( "Existen seis subespecies de tigre, de las cuales la de Bengala es la más numerosa.", { locale: "es_ES" } );
		expect( fleschFunction( mockPaper, new SpanishResearcher( mockPaper ) ) ).toBe( 83.5 );
	} );
} );

describe( "A test that uses the French Flesch Reading", function() {
	it( "returns a score", function() {
		const mockPaper = new Paper( "Comme la plupart des grands herbivores, le cheval dort peu, de trois à cinq heures par jour, " +
			"en raison de sa vulnérabilité aux prédateurs", { locale: "fr_FR" } );
		expect( fleschFunction( mockPaper, new FrenchResearcher( mockPaper ) ) ).toBe( 72.2 );
	} );
} );

describe( "A test that uses the Portuguese Flesch Reading", function() {
	it( "returns a score", function() {
		const mockPaper = new Paper( "Um texto coeso é aquele em que os parágrafos são ligados harmonicamente.", { locale: "pt_PT" } );
		expect( fleschFunction( mockPaper, new PortugueseResearcher( mockPaper ) ) ).toBe( 46.3 );
	} );
} );

describe( "A test that uses the Portuguese Flesch Reading", function() {
	it( "returns a score", function() {
		const mockPaper = new Paper( "O processo de venda na internet começa com um estranho.", { locale: "pt_PT" } );
		expect( fleschFunction( mockPaper, new PortugueseResearcher( mockPaper ) ) ).toBe( 77.9 );
	} );
} );
*/

describe( "A test that returns 0 after sentence formatting", function() {
	it( "returns a score of 0", function() {
		const mockPaper = new Paper( "()" );
		expect( fleschFunction( mockPaper, new EnglishResearcher( mockPaper ) ) ).toBe( 0 );
	} );
} );
