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

		combination1.incrementOccurrences(); combination1.incrementOccurrences();
		sortCombinations( output );
		expect( output ).toEqual( initial );

		combination2.incrementOccurrences(); combination2.incrementOccurrences();
		sortCombinations( output );
		expect( output ).toEqual( reversed );
	} );

	it( "sorts based on length if the relevance is tied", function() {
		const combination1 = new WordCombination( "wordword1", "wordword1", 2 );
		const combination2 = new WordCombination( "word2", "word2", 2 );
		const combination3 = new WordCombination( "word3", "word3", 3 );

		const output = [ combination1, combination2, combination3 ];
		const sorted = [ combination3, combination1, combination2 ];

		sortCombinations( output );

		expect( output ).toEqual( sorted );
	} );
} );

describe( "collapseRelevantWordsOnStem collapses over duplicates by stem", function() {
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

	it( "processes multiple duplicates", function() {
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

	it( "does not return words with single occurrences", function() {
		const wordCombinations = [
			new WordCombination( "sentences", "sentence", 2 ),
			new WordCombination( "sentence", "sentence", 2 ),
			new WordCombination( "whole", "whole", 1 ),
			new WordCombination( "word", "word", 10 ),
			new WordCombination( "words", "word", 11 ),
		];

		const expectedResult = [
			new WordCombination( "word", "word", 21 ),
			new WordCombination( "sentence", "sentence", 4 ),
		];

		const result = collapseRelevantWordsOnStem( wordCombinations );

		expect( result ).toEqual( expectedResult );
	} );
} );

describe( "getRelevantWords", function() {
	it( "takes all single words from the text, stems and counts them", function() {
		const input = "Word word word word word word word word word word. " +
			"More words, More words, More words, More words, More words, More words, More words, More words, More words. " +
			"A whole new sentence, with more words here. " +
			"A whole new sentence, with more words here. ";
		const expected = [
			new WordCombination( "sentence", "sentence", 2 ),
			new WordCombination( "whole", "whole", 2 ),
			new WordCombination( "word", "word", 10 ),
			new WordCombination( "words", "words", 11 ),
		];

		const words = getRelevantWords( input, "en", morphologyData );

		expect( words ).toEqual( expected );
	} );

	it( "also does well with a longer and more complex text", function() {
		const input = "Here are a ton of syllables. Syllables are very important. I think the syllable combinations are even more important. " +
			"Syllable combinations for the win! This text needs to contain 200 words, because one filter will only work if a text is " +
			"long enough. 200 words is really, really long. I will just start talking about the weather. " +
			"The weather is nice today, don't you think? It is sunny outside. It has been a while since it has rained. " +
			"Let me think of something else to talk about.";
		const expected = [
			new WordCombination( "combinations", 2 ),
			new WordCombination( "syllable", 2 ),
			new WordCombination( "syllables", 2 ),
			new WordCombination( "text", 2 ),
			new WordCombination( "weather", 2 ),
			new WordCombination( "words", 2 ),
		];

		const words = getRelevantWords( input, "en", morphologyData );

		expect( words ).toEqual( expected );
	} );

	it( "does not filter out anything if the language does not have function words", function() {
		const input = "Here are a ton of syllables";
		const expected = [
			new WordCombination( "a", "a", 1 ),
			new WordCombination( "are", "are", 1 ),
			new WordCombination( "here", "here", 1 ),
			new WordCombination( "of", "of", 1 ),
			new WordCombination( "syllables", "syllables", 1 ),
			new WordCombination( "ton", "ton", 1 ),
		];

		const words = getRelevantWords( input, "bla", morphologyData );

		expect( words ).toEqual( expected );
	} );
} );

describe( "getRelevantWordsFromPaperAttributes", function() {
	it( "gets all non-function words from the attributes", function() {
		const expected = [
			new WordCombination( "keyphrase", "keyphrase", 3 ),
			new WordCombination( "synonym", "synonym", 9 ),
			new WordCombination( "o-my", "o-my", 3 ),
			new WordCombination( "interesting", "interesting", 3 ),
			new WordCombination( "metadescription", "metadescription", 3 ),
			new WordCombination( "paper", "paper", 3 ),
			new WordCombination( "analysing", "analysing", 3 ),
			new WordCombination( "pretty", "pretty", 3 ),
			new WordCombination( "title", "title", 3 ),
			new WordCombination( "subheading", "subheading", 6 ),
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
