import wordComplexity from "../../../src/languageProcessing/researches/wordComplexity.js";
import Paper from "../../../src/values/Paper";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import GermanResearcher from "../../../src/languageProcessing/languages/de/Researcher";
import SpanishResearcher from "../../../src/languageProcessing/languages/es/Researcher";
import FrenchResearcher from "../../../src/languageProcessing/languages/fr/Researcher";
import wordComplexityHelperEnglish from "../../../src/languageProcessing/languages/en/helpers/checkIfWordIsComplex";
import wordComplexityHelperGerman from "../../../src/languageProcessing/languages/de/helpers/checkIfWordIsComplex";
import wordComplexityHelperSpanish from "../../../src/languageProcessing/languages/es/helpers/checkIfWordIsComplex";
import wordComplexityHelperFrench from "../../../src/languageProcessing/languages/fr/helpers/checkIfWordIsComplex";
import wordComplexityConfigEnglish from "../../../src/languageProcessing/languages/en/config/wordComplexity";
import wordComplexityConfigGerman from "../../../src/languageProcessing/languages/de/config/wordComplexity";
import wordComplexityConfigSpanish from "../../../src/languageProcessing/languages/es/config/wordComplexity";
import wordComplexityConfigFrench from "../../../src/languageProcessing/languages/fr/config/wordComplexity";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const premiumDataEn = getMorphologyData( "en" );
const premiumDataDe = getMorphologyData( "de" );
const premiumDataEs = getMorphologyData( "es" );
const premiumDataFr = getMorphologyData( "fr" );

describe( "a test for getting the complex words in the sentence and calculating their percentage",  function() {
	let researcher;

	beforeEach( () => {
		researcher = new EnglishResearcher();
		researcher.addHelper( "checkIfWordIsComplex", wordComplexityHelperEnglish );
		researcher.addConfig( "wordComplexity", wordComplexityConfigEnglish );
		researcher.addResearchData( "morphology", premiumDataEn );
	} );

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

		researcher.setPaper( paper );

		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [
			{
				complexWords: [ "tortoiseshell" ],
				sentence: "Also called torties for short, tortoiseshell cats combine two colors other than white, " +
					"either closely mixed or in larger patches.",
			},
			{
				complexWords: [ "reserved", "particolored", "markings" ],
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
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 9.04 );
	} );
	it( "should return an empty array and 0% if there is no complex word found in the text", () => {
		const paper = new Paper( "This is short text. This is another short text. A text about Calico." );
		researcher.setPaper( paper );

		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [] );
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 0 );
	} );

	it( "should return an empty array and 0% if the only complex words are inside an element we want to exclude from the analysis", () => {
		const paper = new Paper( "This is short text. <code>tortoiseshell</code> A text about Calico." );
		researcher.setPaper( paper );

		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [] );
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 0 );
	} );

	it( "should return an empty array and 0% if the only complex word are is a shortcode ", function() {
		const paper = new Paper( "This is short text. [tortoiseshell] A text about Calico.", { shortcodes: [ "tortoiseshell" ] } );
		researcher.setPaper( paper );

		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [] );
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 0 );
	} );

	it( "should return an empty array and 0% if there is no complex word found in the text: " +
		"Also test with a word starting with capital letter enclosed in different types of quotation mark.", () => {
		let paper = new Paper( "This is short text. This is another short text. A text about \"Calico\"." );
		researcher.setPaper( paper );

		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [] );
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 0 );

		paper = new Paper( "This is short text. This is another short text. A text about 'Calico'." );
		researcher.setPaper( paper );

		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [] );
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 0 );

		paper = new Paper( "This is short text. This is another short text. A text about ’Calico’." );
		researcher.setPaper( paper );

		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [] );
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 0 );

		paper = new Paper( "This is short text. This is another short text. A text about ‘Calico‘." );
		researcher.setPaper( paper );

		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [] );
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 0 );
	} );
} );

describe( "test with different language specific helper and config", () => {
	it( "uses Researchers for different languages and returns an empty array and 0% " +
		"when there are long function words in the text.", () => {
		let paper = new Paper( "Present company notwithstanding, something. This is the thirteenth time I've tripped here." );
		let researcher = new EnglishResearcher( paper );
		researcher.addHelper( "checkIfWordIsComplex", wordComplexityHelperEnglish );
		researcher.addConfig( "wordComplexity", wordComplexityConfigEnglish );
		researcher.addResearchData( "morphology", premiumDataEn );

		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [] );
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 0 );

		paper = new Paper( "Ein sogenanntes 'Gope-Brett', das einen mächtigen, mythischen Ahnen darstellt." );
		researcher = new GermanResearcher( paper );
		researcher.addHelper( "checkIfWordIsComplex", wordComplexityHelperGerman );
		researcher.addConfig( "wordComplexity", wordComplexityConfigGerman );
		researcher.addResearchData( "morphology", premiumDataDe );

		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [] );
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 0 );

		paper = new Paper( "Si usted tiene cualesquiera preguntas o dudas, usted debe investigar. Empezábamos." );
		researcher = new SpanishResearcher( paper );
		researcher.addHelper( "checkIfWordIsComplex", wordComplexityHelperSpanish );
		researcher.addConfig( "wordComplexity", wordComplexityConfigSpanish );
		researcher.addResearchData( "morphology", premiumDataEs );

		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [] );
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 0 );

		paper = new Paper( "Yoast s'engage à s'améliorer continuellement en matière. Éternellement jeunes." );
		researcher = new FrenchResearcher( paper );
		researcher.addHelper( "checkIfWordIsComplex", wordComplexityHelperFrench );
		researcher.addConfig( "wordComplexity", wordComplexityConfigFrench );
		researcher.addResearchData( "morphology", premiumDataFr );

		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [] );
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 0 );

		paper = new Paper( "Nach der von Erzbischof Hinkmar von Reims gebildeten Legende hat gegen Ende des 5. Wahrscheinlichkeit verhältnismäßig." );
		researcher = new GermanResearcher( paper );
		researcher.addHelper( "checkIfWordIsComplex", wordComplexityHelperGerman );
		researcher.addConfig( "wordComplexity", wordComplexityConfigGerman );
		researcher.addResearchData( "morphology", premiumDataDe );

		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [] );
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 0 );
	} );

	it( "returns an empty array and 0% when there are only function words and keyphrases in the text.", () => {
		let paper = new Paper( "These new paradigms are hard to understand.", { keyword: "paradigm" } );
		let researcher = new EnglishResearcher( paper );
		researcher.addHelper( "checkIfWordIsComplex", wordComplexityHelperEnglish );
		researcher.addConfig( "wordComplexity", wordComplexityConfigEnglish );
		researcher.addResearchData( "morphology", premiumDataEn );

		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [] );
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 0 );

		paper = new Paper( "Contamos con lo más nuevo en computadoras.", { keyword: "nueva computadora" } );
		researcher = new SpanishResearcher( paper );
		researcher.addHelper( "checkIfWordIsComplex", wordComplexityHelperSpanish );
		researcher.addConfig( "wordComplexity", wordComplexityConfigSpanish );
		researcher.addResearchData( "morphology", premiumDataEs );

		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [] );
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 0 );
	} );

	it( "should not recognize German function words to be complex, no matter whether they are capitalized or not", () => {
		const paper = new Paper( "Nach der von Erzbischof Hinkmar von Reims gebildeten Legende hat gegen Ende des 5. Wahrscheinlichkeit verhältnismäßig." );
		const researcher = new GermanResearcher( paper );
		researcher.addHelper( "checkIfWordIsComplex", wordComplexityHelperGerman );
		researcher.addConfig( "wordComplexity", wordComplexityConfigGerman );
		researcher.addResearchData( "morphology", premiumDataDe );

		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [] );
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 0 );
	} );
} );
