import wordComplexity from "../../../src/languageProcessing/researches/wordComplexity.js";
import Paper from "../../../src/values/Paper";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import GermanResearcher from "../../../src/languageProcessing/languages/de/Researcher";
import SpanishResearcher from "../../../src/languageProcessing/languages/es/Researcher";
import FrenchResearcher from "../../../src/languageProcessing/languages/fr/Researcher";

describe( "a test for getting the complex words in the sentence and calculating their percentage",  function() {
	it( "returns an array with the complex words from the text in English", function() {
		const paper = new Paper( "Also called torties for short, tortoiseshell cats combine two colors other than white, " +
			"either closely mixed or in larger patches." +
			" The colors are often described as red and black, but the \"red\" patches can instead be orange, yellow, or cream," +
			" and the \"black\" can instead be chocolate, gray, tabby, or blue. Tortoiseshell cats with the tabby pattern as one of their colors " +
			"are sometimes referred to as a torbie. Cats having torbie coats are sometimes referred to as torbie cats.\n" +
			"\"Tortoiseshell\" is typically reserved for particolored cats with relatively small or no white markings. " +
			"Those that are predominantly white with tortoiseshell patches are described as tricolor, tortoiseshell-and-white " +
			"(in the United Kingdom), or calico (in Canada and the United States).\n" +
			"Cats with tortoiseshell pattern and small blotches of white are sometimes referred to as \"tortico\" by their owners, " +
			"a portmanteau of \"tortie\" and \"calico\"\n" +
			"Torbie cats with a predominantly white undercoat are often referred to as \"caliby\" by their respective owners, " +
			"an amalgamation of Calico and Tabby." );

		const researcher = new EnglishResearcher( paper );

		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [
			{
				complexWords: [ "tortoiseshell" ],
				sentence: "Also called torties for short, tortoiseshell cats combine two colors other than white, " +
					"either closely mixed or in larger patches.",
			},
			{
				complexWords: [ "typically", "reserved", "particolored", "markings" ],
				sentence: "\"Tortoiseshell\" is typically reserved for particolored cats with relatively small or no white markings.",
			},
			{
				complexWords: [ "predominantly", "tortoiseshell", "tricolor", "tortoiseshell-and-white" ],
				sentence: "Those that are predominantly white with tortoiseshell patches are described as tricolor, " +
					"tortoiseshell-and-white (in the United Kingdom), or calico (in Canada and the United States).",
			},
			{
				complexWords: [ "tortoiseshell", "blotches", "portmanteau" ],
				sentence: "Cats with tortoiseshell pattern and small blotches of white are sometimes referred to as \"tortico\" " +
					"by their owners, a portmanteau of \"tortie\" and \"calico\"",
			},
			{
				complexWords: [ "predominantly", "undercoat", "respective", "amalgamation" ],
				sentence: "Torbie cats with a predominantly white undercoat are often referred to as \"caliby\" by their respective owners," +
					" an amalgamation of Calico and Tabby.",
			},
		]
		);
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 9.64 );
	} );
	it( "should return an empty array and 0% if there is no complex word found in the text", () => {
		const paper = new Paper( "This is short text. This is another short text. A text about Calico." );
		const researcher = new EnglishResearcher( paper );

		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [] );
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 0 );
	} );

	it( "should return an empty array and 0% if there is no complex word found in the text: " +
		"Also test with a word starting with capital letter enclosed in different types of quotation mark.", () => {
		let paper = new Paper( "This is short text. This is another short text. A text about \"Calico\"." );
		let researcher = new EnglishResearcher( paper );

		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [] );
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 0 );

		paper = new Paper( "This is short text. This is another short text. A text about 'Calico'." );
		researcher = new EnglishResearcher( paper );

		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [] );
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 0 );

		paper = new Paper( "This is short text. This is another short text. A text about ’Calico’." );
		researcher = new EnglishResearcher( paper );

		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [] );
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 0 );

		paper = new Paper( "This is short text. This is another short text. A text about ‘Calico‘." );
		researcher = new EnglishResearcher( paper );

		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [] );
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 0 );
	} );

	it( "uses Researchers for different languages and returns an empty array and 0% " +
		"when there are long function words in the text.", () => {
		let paper = new Paper( "Present company notwithstanding, something. This is the thirteenth time I've tripped here." );
		let researcher = new EnglishResearcher( paper );
		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [] );
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 0 );

		paper = new Paper( "Ein sogenanntes 'Gope-Brett', das einen mächtigen, mythischen Ahnen darstellt." );
		researcher = new GermanResearcher( paper );
		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [] );
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 0 );

		paper = new Paper( "Si usted tiene cualesquiera preguntas o dudas, usted debe investigar. Empezábamos." );
		researcher = new SpanishResearcher( paper );
		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [] );
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 0 );

		paper = new Paper( "Yoast s'engage à s'améliorer continuellement en matière. Éternellement jeunes." );
		researcher = new FrenchResearcher( paper );
		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [] );
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 0 );
	} );
} );
