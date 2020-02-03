import Researcher from "../../src/researcher";
import getWordFormsFromText from "../../src/researches/getWordFormsFromText";
import Paper from "../../src/values/Paper";
import getMorphologyData from "../specHelpers/getMorphologyData";
const morphologyDataEN = getMorphologyData( "en" );
const morphologyDataDE = getMorphologyData( "de" );

const testText = "I walked my dog. The cat walks along. The canine and the feline were walking.";

describe( "A test from getting word forms from the text, based on the stems of a keyphrase", function() {
	it( "returns forms found in the text for multiple keyphrases and synonyms with multiple words;" +
		"English stemmer", function() {
		const text = "A cat's dog and a dog's cat. The feline purrs. The canine is friendly."
		const attributes = {
			keyword: "cats and dogs",
			synonyms: "purring felines, friendly canines",
		};
		const testPaper = new Paper( text, attributes );
		const researcher = new Researcher( testPaper );
		researcher.addResearchData( "morphology", morphologyDataEN );

		expect( getWordFormsFromText( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [ "cats", "cat's", "cat" ], [ "dogs", "dog", "dog's" ] ],
				synonymsForms: [ [ [ "purring", "purrs" ], [ "felines", "feline" ] ], [ [ "friendly" ], [ "canines", "canine" ] ] ],
			}
		);
	} );

	it( "returns forms found in the text for multiple keyphrases and synonyms with multiple words;" +
		"German stemmer", function() {
		const text = "Eine Orange und eine Heidelbeere. Die Apfelsinen sind sauer. Die Blaubeeren sind süß."
		const attributes = {
			keyword: "Orangen und Heidelbeeren",
			synonyms: "saure Apfelsine, süße Blaubeere",
			locale: "de_DE",
		};
		const testPaper = new Paper( text, attributes );
		const researcher = new Researcher( testPaper );
		researcher.addResearchData( "morphology", morphologyDataDE );

		expect( getWordFormsFromText( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [ "orangen" ], [ "heidelbeeren" ] ],
				synonymsForms: [ [ [ "saure", "sauer" ], [ "apfelsine" ] ], [ [ "süße", "süß" ], [ "blaubeere" ] ] ],
			}
		);
	} );

	it( "returns empty structure if no keyword or synonyms are supplied", function() {
		const attributes = {
			keyword: "",
			synonyms: "",
		};
		const testPaper = new Paper( testText, attributes );
		const researcher = new Researcher( testPaper );

		expect( getWordFormsFromText( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [],
				synonymsForms: [],
			}
		);
	} );

	it( "returns an empty keyphrase field if only synonyms are supplied", function() {
		const attributes = {
			keyword: "",
			synonyms: "cats and dogs",
		};
		const testPaper = new Paper( testText, attributes );
		const researcher = new Researcher( testPaper );

		expect( getWordFormsFromText( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [],
				synonymsForms: [ [ [ "cats" ], [ "dogs" ] ] ],
			}
		);
	} );

	it( "returns keyphrase forms found in the paper", function() {
		const attributes = {
			keyword: "cats and dogs",
		};
		const testPaper = new Paper( testText, attributes );
		const researcher = new Researcher( testPaper );
		researcher.addResearchData( "morphology", morphologyDataEN );

		expect( getWordFormsFromText( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [ "cats", "cat" ], [ "dogs", "dog" ] ],
				synonymsForms: [],
			}
		);
	} );

	it( "returns forms for a keyphrase and multiple synonyms", function() {
		const attributes = {
			keyword: "cats and dogs",
			synonyms: "felines, canines",
		};
		const testPaper = new Paper( testText, attributes );
		const researcher = new Researcher( testPaper );
		researcher.addResearchData( "morphology", morphologyDataEN );

		expect( getWordFormsFromText( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [  "cats", "cat" ], [ "dogs", "dog" ] ],
				synonymsForms: [ [ [ "felines", "feline" ] ], [ [ "canines", "canine" ] ] ],
			}
		);
	} );

	it( "returns the (sanitized) original form of a word if no forms were found in the paper", function() {
		const attributes = {
			keyword: "Cats and dogs",
		};

		const testPaper = new Paper( "", attributes );
		const researcher = new Researcher( testPaper );
		researcher.addResearchData( "morphology", morphologyDataEN );

		expect( getWordFormsFromText( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [ "cats" ], [ "dogs" ] ],
				synonymsForms: [],
			}
		);
	} );

	it( "returns multiple forms of a stem found in the text of the paper", function() {
		const testTextWalkMultipleForms = "The cat walked quickly." +
			"More cats are walking up there." +
			"They just walk and walk.";
		const attributes = {
			keyword: "the cat walks",
		};
		const testPaper = new Paper( testTextWalkMultipleForms, attributes );
		const researcher = new Researcher( testPaper );
		researcher.addResearchData( "morphology", morphologyDataEN );

		expect( getWordFormsFromText( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [ "cat", "cats" ], [ "walks", "walked", "walking", "walk"  ] ],
				synonymsForms: [],
			}
		);
	} );

	it( "returns multiple forms of a stem found in the text, slug, title and meta description of the paper", function() {
		const attributes = {
			keyword: "walk",
			description: "walking",
			title: "walks",
			url: "walked",
		};

		const testPaper = new Paper( "walk's", attributes );
		const researcher = new Researcher( testPaper );
		researcher.addResearchData( "morphology", morphologyDataEN );

		expect( getWordFormsFromText( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [ "walk", "walk's", "walks", "walked", "walking" ] ],
				synonymsForms: [],
			}
		);
	} );

	it( "returns the exact match if the keyphrase is embedded in quotation marks", function() {
		const attributes = {
			keyword: "\"cats and dogs\"",
			synonyms: "felines, canines",
		};
		const testPaper = new Paper( "A canine and a feline are walking.", attributes );
		const researcher = new Researcher( testPaper );
		researcher.addResearchData( "morphology", morphologyDataEN );

		expect( getWordFormsFromText( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [ "cats and dogs" ] ],
				synonymsForms: [ [ [ "felines", "feline"  ] ], [ [ "canines", "canine" ] ] ],
			}
		);
	} );

	it( "returns the exact match if a synonym is embedded in quotation marks", function() {
		const attributes = {
			keyword: "cats and dogs",
			synonyms: "\"some purring felines\", canines",
		};
		const testPaper = new Paper( "A cat and a dog are walking.", attributes );
		const researcher = new Researcher( testPaper );
		researcher.addResearchData( "morphology", morphologyDataEN );

		expect( getWordFormsFromText( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [ "cats", "cat" ], [ "dogs", "dog" ] ],
				synonymsForms: [ [ [ "some purring felines"  ] ], [ [ "canines" ] ] ],
			}
		);
	} );

	it( "returns the keyphrase and synonyms unaltered for a language when there for which we have a stemmer," +
		"and function word support, but no morphology data is available", function() {
		const attributes = {
			keyword: "cats and dogs",
			synonyms: "felines, canines",
		};
		const testPaper = new Paper( testText, attributes );
		const researcher = new Researcher( testPaper );

		expect( getWordFormsFromText( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [ "cats" ], [ "dogs" ] ],
				synonymsForms: [ [ [ "felines" ] ], [ [ "canines" ] ] ],
			}
		);
	} );

	it( "returns unaltered topic words for a language which has neither a stemmer nor morphology data," +
		"but which has function word support", function() {
		const attributes = {
			keyword: "cane e gatto",
			locale: "it_IT",
		};
		const testPaper = new Paper( "Cane e gatto. Cani e gatti.", attributes );
		const researcher = new Researcher( testPaper );

		expect( getWordFormsFromText( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [ "cane" ], [ "gatto" ] ],
				synonymsForms: [  ],
			}
		);
	} );

	it( "returns the keyphrase and synonyms with function words filtered for a language without morphology" +
		"or function word support", function() {
		const attributes = {
			keyword: "katte en honde",
			locale: "af_ZA",
		};
		const testPaper = new Paper( "", attributes );
		const researcher = new Researcher( testPaper );

		expect( getWordFormsFromText( testPaper, researcher ) ).toEqual(
			{
				keyphraseForms: [ [ "katte" ], [ "en" ], [ "honde" ] ],
				synonymsForms: [],
			}
		);
	} );
} );
