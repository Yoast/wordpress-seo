import WordCombination from "../../src/values/WordCombination";
import {
	getRelevantWords,
	getRelevantWordsFromPaperAttributes,
	getRelevantCombinations,
	collapseRelevantWordsOnStem,
	sortCombinations,
} from "../../src/stringProcessing/relevantWords";
import { en as morphologyData } from "../../premium-configuration/data/morphologyData.json";

describe( "getRelevantCombinations", function() {
	it( "removes combinations with one occurence", function() {
		const input = [
			new WordCombination( "irrelevant", "irrelevant", 1 ),
			new WordCombination( "occurrence", "occurrence", 2 ),
		];
		const expected = [
			new WordCombination( "occurrence", "occurrence", 2 ),
		];

		const actual = getRelevantCombinations( input );

		expect( actual ).toEqual( expected );
	} );

	it( "removes numbers", function() {
		const input = [
			new WordCombination( "200", "200", 1 ),
			new WordCombination( "100", "100", 2 ),
		];
		const expected = [];

		const actual = getRelevantCombinations( input );

		expect( actual ).toEqual( expected );
	} );
} );

describe( "sortCombinations", function() {
	it( "sorts based on number of occurrences", function() {
		const combination1 = new WordCombination( "word1", "word1", 2 );
		const combination2 = new WordCombination( "word2", "word2", 3 );

		const output = [ combination1, combination2 ];
		const initial = [ combination1, combination2 ];
		const reversed = [ combination2, combination1 ];

		sortCombinations( output );

		expect( output ).toEqual( reversed );

		combination1.setOccurrences( combination1.getOccurrences() + 2 );
		sortCombinations( output );
		expect( output ).toEqual( initial );

		combination2.setOccurrences( combination2.getOccurrences() + 2 );
		sortCombinations( output );
		expect( output ).toEqual( reversed );
	} );

	it( "sorts alphabetically if the relevance is tied", function() {
		const combination1 = new WordCombination( "wordA", "wordA", 2 );
		const combination2 = new WordCombination( "wordB", "wordB", 2 );
		const combination3 = new WordCombination( "wordC", "wordC", 3 );

		const output = [ combination1, combination2, combination3 ];
		const sorted = [ combination3, combination1, combination2 ];

		sortCombinations( output );

		expect( output ).toEqual( sorted );
	} );

	it( "preserves the correct alphabetical order: this case is improbable, added for the sake of test coverage", function() {
		const combination1 = new WordCombination( "word", "word", 2 );
		const combination2 = new WordCombination( "word", "word", 2 );

		const output = [ combination1, combination2 ];
		const sorted = [ combination1, combination2 ];

		sortCombinations( output );

		expect( output ).toEqual( sorted );
	} );
} );

describe( "collapseRelevantWordsOnStem collapses over duplicates by stem", function() {
	it( "does not break for a 1-element input array", function() {
		const wordCombinations = [
			new WordCombination( "sentence", "sentence", 2 ),
		];

		const expectedResult = [
			new WordCombination( "sentence", "sentence", 2 ),
		];

		const result = collapseRelevantWordsOnStem( wordCombinations );

		expect( result ).toEqual( expectedResult );
	} );

	it( "properly sorts the input array by stem before collapsing", function() {
		const wordCombinations = [
			new WordCombination( "sentence", "sentence", 2 ),
			new WordCombination( "words", "word", 11 ),
			new WordCombination( "whole", "whole", 2 ),
			new WordCombination( "word", "word", 10 ),
		];

		const expectedResult = [
			new WordCombination( "word", "word", 21 ),
			new WordCombination( "sentence", "sentence", 2 ),
			new WordCombination( "whole", "whole", 2 ),
		];

		const result = collapseRelevantWordsOnStem( wordCombinations );

		expect( result ).toEqual( expectedResult );
	} );

	it( "processes duplicates in the very beginning of the list", function() {
		const wordCombinations = [
			new WordCombination( "sentences", "sentence", 2 ),
			new WordCombination( "sentence", "sentence", 2 ),
			new WordCombination( "words", "word", 11 ),
			new WordCombination( "whole", "whole", 2 ),
			new WordCombination( "word", "word", 10 ),
		];

		const expectedResult = [
			new WordCombination( "word", "word", 21 ),
			new WordCombination( "sentence", "sentence", 4 ),
			new WordCombination( "whole", "whole", 2 ),
		];

		const result = collapseRelevantWordsOnStem( wordCombinations );

		expect( result ).toEqual( expectedResult );
	} );

	it( "processes duplicates in the very end of the list", function() {
		const wordCombinations = [
			new WordCombination( "sentences", "sentence", 2 ),
			new WordCombination( "sentence", "sentence", 2 ),
			new WordCombination( "whole", "whole", 2 ),
			new WordCombination( "word", "word", 10 ),
			new WordCombination( "words", "word", 11 ),
		];

		const expectedResult = [
			new WordCombination( "word", "word", 21 ),
			new WordCombination( "sentence", "sentence", 4 ),
			new WordCombination( "whole", "whole", 2 ),
		];

		const result = collapseRelevantWordsOnStem( wordCombinations );

		expect( result ).toEqual( expectedResult );
	} );

	it( "processes multiple duplicates of stem", function() {
		const wordCombinations = [
			new WordCombination( "sentences", "sentence", 2 ),
			new WordCombination( "wording", "word", 3 ),
			new WordCombination( "worded", "word", 5 ),
			new WordCombination( "sentence", "sentence", 2 ),
			new WordCombination( "word", "word", 1 ),
			new WordCombination( "sentencing", "sentence", 2 ),
			new WordCombination( "words", "word", 2 ),
			new WordCombination( "sentenced", "sentence", 4 ),
			new WordCombination( "wordings", "word", 3 ),
		];

		const expectedResult = [
			new WordCombination( "word", "word", 14 ),
			new WordCombination( "sentence", "sentence", 10 ),
		];

		const result = collapseRelevantWordsOnStem( wordCombinations );

		expect( result ).toEqual( expectedResult );
	} );

	it( "processes multiple duplicates of stem and word", function() {
		const wordCombinations = [
			new WordCombination( "word", "word", 1 ),
			new WordCombination( "sentences", "sentence", 2 ),
			new WordCombination( "wording", "word", 3 ),
			new WordCombination( "worded", "word", 5 ),
			new WordCombination( "sentence", "sentence", 2 ),
			new WordCombination( "word", "word", 1 ),
			new WordCombination( "sentencing", "sentence", 2 ),
			new WordCombination( "words", "word", 2 ),
			new WordCombination( "sentenced", "sentence", 4 ),
			new WordCombination( "wordings", "word", 3 ),
		];

		const expectedResult = [
			new WordCombination( "word", "word", 15 ),
			new WordCombination( "sentence", "sentence", 10 ),
		];

		const result = collapseRelevantWordsOnStem( wordCombinations );

		expect( result ).toEqual( expectedResult );
	} );
} );

describe( "getRelevantWords", function() {
	it( "correctly takes single words from the text, orders them by number of occurrences and alphabetically", function() {
		const input = "A text consists of words. This is a test.";
		const expected = [
			new WordCombination( "test", "test", 1 ),
			new WordCombination( "text", "text", 1 ),
			new WordCombination( "words", "words", 1 ),
		];

		const words = getRelevantWords( input, "en", morphologyData );

		expect( words ).toEqual( expected );
	} );
	it( "takes all single words from the text, stems and counts them", function() {
		const input = "Word word word word word word word word word word. " +
			"More words, More words, More words, More words, More words, More words, More words, More words, 3 more words. " +
			"A whole new sentence, with more words here. " +
			"A whole new sentence, with more words here. ";
		const expected = [
			new WordCombination( "words", "words", 11 ),
			new WordCombination( "word", "word", 10 ),
			new WordCombination( "sentence", "sentence", 2 ),
			new WordCombination( "whole", "whole", 2 ),
			new WordCombination( "3", "3", 1 ),
		];

		const words = getRelevantWords( input, "en", morphologyData );

		expect( words ).toEqual( expected );
	} );

	it( "also does well with a longer and more complex text", function() {
		const input = "Here are a ton of syllables. Syllables are very important, syllables are the best. " +
			"Every syllable is a pain when it comes to producing them on demand. " +
			"It's so different when it's just free speech! A syllable then costs a tiny effort, almost " +
			"no effort at all! That is wonderful!! And here it comes again! " +
			"Here are a ton of syllables. Syllables are very important, syllables are the best. " +
			"Every syllable is a pain when it comes to producing them on demand. " +
			"It's so different when it's just free speech! A syllable then costs a tiny effort, almost " +
			"no effort at all! That is wonderful!!";
		const expected = [
			new WordCombination( "syllables", "syllables", 6 ),
			new WordCombination( "effort", "effort", 4 ),
			new WordCombination( "syllable", "syllable", 4 ),
			new WordCombination( "costs", "costs", 2 ),
			new WordCombination( "demand", "demand", 2 ),
			new WordCombination( "free", "free", 2 ),
			new WordCombination( "pain", "pain", 2 ),
			new WordCombination( "producing", "producing", 2 ),
			new WordCombination( "speech", "speech", 2 ),
			new WordCombination( "wonderful", "wonderful", 2 ),
		];

		const words = getRelevantWords( input, "en", morphologyData );

		expect( words ).toEqual( expected );
	} );

	it( "does not filter out anything if the language does not have function words", function() {
		const input = "Here are a ton of syllables Here are a ton of syllables";
		const expected = [
			new WordCombination( "a", "a", 2 ),
			new WordCombination( "are", "are", 2 ),
			new WordCombination( "here", "here", 2 ),
			new WordCombination( "of", "of", 2 ),
			new WordCombination( "syllables", "syllables", 2 ),
			new WordCombination( "ton", "ton", 2 ),
		];

		const words = getRelevantWords( input, "bla", morphologyData );

		expect( words ).toEqual( expected );
	} );

	it( "does not break if there are no words in the input", function() {
		const input = "! - ?.... ";
		const expected = [];

		const words = getRelevantWords( input, "en", morphologyData );

		expect( words ).toEqual( expected );
	} );
} );

describe( "getRelevantWordsFromPaperAttributes", function() {
	it( "gets all non-function words from the attributes", function() {
		const expected = [
			new WordCombination( "synonym", "synonym", 9 ),
			new WordCombination( "subheading", "subheading", 6 ),
			new WordCombination( "analysing", "analysing", 3 ),
			new WordCombination( "interesting", "interesting", 3 ),
			new WordCombination( "keyphrase", "keyphrase", 3 ),
			new WordCombination( "metadescription", "metadescription", 3 ),
			new WordCombination( "o-my", "o-my", 3 ),
			new WordCombination( "paper", "paper", 3 ),
			new WordCombination( "pretty", "pretty", 3 ),
			new WordCombination( "title", "title", 3 ),

		];

		const words = getRelevantWordsFromPaperAttributes(
			{
				keyphrase: "This is a nice keyphrase",
				synonyms: "This is a synonym one, a synonym two and an o-my synonym",
				title: "This is a pretty long title!",
				metadescription: "This is an interesting metadescription of the paper that we are analysing.",
				subheadings: [ "subheading one", "subheading two" ],
			},
			"en",
			morphologyData
		);

		expect( words ).toEqual( expected );
	} );
} );
