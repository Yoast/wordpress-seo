import relevantWordsResearch from "../../src/researches/relevantWords";
import Paper from "../../src/values/Paper";
import WordCombination from "../../src/values/WordCombination";

import functionWordsFactory from "../../src/researches/english/functionWords.js";
const functionWords = functionWordsFactory().all;

describe( "relevantWords research", function() {
	it( "calls through to the string processing function", function() {
		let input = "Here are a ton of syllables. Syllables are very important. I think the syllable combinations are even more important. Syllable combinations for the win!";
		input = new Paper( input );
		const expected = [
			new WordCombination( [ "syllable", "combinations" ], 2, functionWords ),
			new WordCombination( [ "syllables" ], 2, functionWords ),
			new WordCombination( [ "syllable" ], 2, functionWords ),
			new WordCombination( [ "combinations" ], 2, functionWords ),
		];

		// Make sure our words aren't filtered by density.
		spyOn( WordCombination.prototype, "getDensity" ).and.returnValue( 0.01 );

		const words = relevantWordsResearch( input );

		words.forEach( function( word ) {
			delete( word._relevantWords );
		} );

		expect( words ).toEqual( expected );
	} );

	it( "calls through to the string processing function", function() {
		let input = "As we announced at YoastCon, we’re working together with Bing and Google to allow live indexing for " +
			"everyone who uses Yoast SEO — free and premium. " +
			"<h2>Subheading!</h2>" +
			"In an update currently planned for the end of March, we’ll " +
			"allow users to connect their sites to MyYoast, our customer portal. After that we’ll roll out live indexing, " +
			"which means every time you publish, update, or delete a post, that will be reflected almost instantly into " +
			"Bing and Google’s indices. How does this work? When you connect your site to MyYoast...";
		input = new Paper( input, {
			keyword: "keyphrase",
			synonyms: "synonym one, synonym two",
			title: "Amazing title",
			description: "Awesome metadescription",
			locale: "en_EN",
		} );
		const expected = [
			new WordCombination( [ "keyphrase" ], 5, functionWords ),
			new WordCombination( [ "synonym" ], 5, functionWords ),
			new WordCombination( [ "metadescription" ], 5, functionWords ),
			new WordCombination( [ "amazing" ], 5, functionWords ),
			new WordCombination( [ "title" ], 5, functionWords ),
			new WordCombination( [ "subheading" ], 5, functionWords ),
			new WordCombination( [ "live", "indexing" ], 2, functionWords ),
			new WordCombination( [ "bing" ], 2, functionWords ),
			new WordCombination( [ "allow" ], 2, functionWords ),
			new WordCombination( [ "live" ], 2, functionWords ),
			new WordCombination( [ "indexing" ], 2, functionWords ),
			new WordCombination( [ "update" ], 2, functionWords ),
			new WordCombination( [ "connect" ], 2, functionWords ),
			new WordCombination( [ "myyoast" ], 2, functionWords ),
		];

		const words = relevantWordsResearch( input );

		words.forEach( function( word ) {
			delete( word._relevantWords );
		} );

		expect( words ).toEqual( expected );
	} );
} );
