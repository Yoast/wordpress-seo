import wordComplexity from "../../../src/languageProcessing/researches/wordComplexity.js";
import Paper from "../../../src/values/Paper";
import Researcher from "../../../src/languageProcessing/languages/en/Researcher";

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

		const researcher = new Researcher( paper );

		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [
			{
				complexWords: [
					{ complexity: true, word: "torties", wordIndex: 2 },
					{ complexity: true, word: "tortoiseshell", wordIndex: 5 },
					{ complexity: true, word: "combine", wordIndex: 7 },
					{ complexity: true, word: "patches", wordIndex: 19 },
				],
				sentence: "Also called torties for short, tortoiseshell cats combine two colors other than white, " +
					"either closely mixed or in larger patches.",
			},
			{
				complexWords: [
					{ complexity: true, word: "patches", wordIndex: 12 },
				],
				sentence: "The colors are often described as red and black, but the \"red\" patches can instead be orange, yellow, " +
					"or cream, and the \"black\" can instead be chocolate, gray, tabby, or blue.",
			},
			{
				complexWords: [
					{ complexity: true, word: "torbie", wordIndex: 17 },
				],
				sentence: "Tortoiseshell cats with the tabby pattern as one of their colors are sometimes referred to as a torbie.",
			},
			{
				complexWords: [
					{ complexity: true, word: "torbie", wordIndex: 2 },
					{ complexity: true, word: "torbie", wordIndex: 9 },
				],
				sentence: "Cats having torbie coats are sometimes referred to as torbie cats.",
			},
			{
				complexWords: [
					{ complexity: true, word: "typically", wordIndex: 2 },
					{ complexity: true, word: "reserved", wordIndex: 3 },
					{ complexity: true, word: "particolored", wordIndex: 5 },
					{ complexity: true, word: "markings", wordIndex: 13 },
				],
				sentence: "\"Tortoiseshell\" is typically reserved for particolored cats with relatively small or no white markings.",
			},
			{
				complexWords: [
					{ complexity: true, word: "predominantly", wordIndex: 3 },
					{ complexity: true, word: "tortoiseshell", wordIndex: 6 },
					{ complexity: true, word: "patches", wordIndex: 7 },
					{ complexity: true, word: "tricolor", wordIndex: 11 },
					{ complexity: true, word: "tortoiseshell-and-white", wordIndex: 12 },
					{ complexity: true, word: "calico", wordIndex: 18 },
				],
				sentence: "Those that are predominantly white with tortoiseshell patches are described as tricolor, " +
					"tortoiseshell-and-white (in the United Kingdom), or calico (in Canada and the United States).",
			},
			{
				complexWords: [
					{ complexity: true, word: "tortoiseshell", wordIndex: 2 },
					{ complexity: true, word: "blotches", wordIndex: 6 },
					{ complexity: true, word: "tortico", wordIndex: 14 },
					{ complexity: true, word: "owners", wordIndex: 17 },
					{ complexity: true, word: "portmanteau", wordIndex: 19 },
					{ complexity: true, word: "tortie", wordIndex: 21 },
					{ complexity: true, word: "calico", wordIndex: 23 },
				],
				sentence: "Cats with tortoiseshell pattern and small blotches of white are sometimes referred to as \"tortico\" " +
					"by their owners, a portmanteau of \"tortie\" and \"calico\"",
			},
			{
				complexWords: [
					{ complexity: true, word: "predominantly", wordIndex: 4 },
					{ complexity: true, word: "undercoat", wordIndex: 6 },
					{ complexity: true, word: "caliby", wordIndex: 12 },
					{ complexity: true, word: "respective", wordIndex: 15 },
					{ complexity: true, word: "owners", wordIndex: 16 },
					{ complexity: true, word: "amalgamation", wordIndex: 18 },
				],
				sentence: "Torbie cats with a predominantly white undercoat are often referred to as \"caliby\" by their respective owners," +
					" an amalgamation of Calico and Tabby.",
			},
		]
		);
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 18.67 );
	} );
} );
