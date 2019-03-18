import getProminentWordsForInsights from "../../src/researches/getProminentWordsForInsights";
import Paper from "../../src/values/Paper";
import Researcher from "../../src/researcher";
import WordCombination from "../../src/values/WordCombination";
import morphologyData from "../../premium-configuration/data/morphologyData.json";

describe( "getProminentWordsForInsights research", function() {
	it( "does not break if no morphology support is added for the language", function() {
		const paper = new Paper( "texte  et texte et texte et texte et texte", { locale: "fr_FR" } );

		const researcher = new Researcher( paper  );
		researcher.addResearchData( "morphology", morphologyData );

		const expected = [
			new WordCombination( "texte", "texte", 5 ),
		];

		const words = getProminentWordsForInsights( paper, researcher );

		expect( words ).toEqual( expected );
	} );

	it( "returns insights from the text alone (not attributes)", function() {
		const paper = new Paper( "Here are a ton of syllables. Syllables are very important. I think the syllable " +
			"combinations are even more important. Syllable combinations for the win! Here are a ton of syllables. " +
			"Syllables are very important. I think the syllable combinations are even more important. " +
			"I say I think the syllable combinations are even more important. Syllable combinations for the win!", { keyword: "hahahahahaha" } );

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const expected = [
			new WordCombination( "syllable", "syllable", 9 ),
			new WordCombination( "combinations", "combination", 5 ),
		];

		const words = getProminentWordsForInsights( paper, researcher );

		expect( words ).toEqual( expected );
	} );

	it( "does not return words that were used less than 5 times", function() {
		const paper = new Paper( "As we announced at YoastCon, we’re working together with Bing and Google to allow live indexing for " +
			"everyone who uses Yoast SEO — free and premium. <h2>Subheading!</h2>In an update currently planned for the end of March, we'll " +
			"allow users to connect their sites to MyYoast, our customer portal. After that we'll roll out live indexing, " +
			"which means every time you publish, update, or delete a post, that will be reflected almost instantly into " +
			"Bing and Google’s indices. How does this work? When you connect your site to MyYoast. " +
			"As we announced at YoastCon, we’re working together with Bing and Google to allow live indexing for " +
			"everyone who uses Yoast SEO — free and premium. <h2>Subheading!</h2>In an update currently planned for the end of March, we'll " +
			"allow users to connect their sites to MyYoast, our customer portal. After that we'll roll out live indexing, " +
			"which means every time you publish, update, or delete a post, that will be reflected almost instantly into " +
			"Bing and Google’s indices. How does this work? When you connect your site to MyYoast. " +
			"As we announced at YoastCon, we’re working together with Bing and Google to allow live indexing for " +
			"everyone who uses Yoast SEO — free and premium. <h2>Subheading!</h2>In an update currently planned for the end of March, we'll " +
			"allow users to connect their sites to MyYoast, our customer portal. After that we'll roll out live indexing, " +
			"which means every time you publish, update, or delete a post, that will be reflected almost instantly into " +
			"Bing and Google’s indices. How does this work? When you connect your site to MyYoast.", {
			keyword: "live indexing Yoast SEO",
			synonyms: "live index",
			title: "Amazing title",
			description: "Awesome metadescription",
			locale: "en_EN",
		} );

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		/*
		 *  The research does not consider relevant words coming from paper attributes, only the text.
		 */
		const expected = [
			new WordCombination( "indexing", "index", 9 ),
			new WordCombination( "allow", "allow", 6 ),
			new WordCombination( "bing", "bing", 6 ),
			new WordCombination( "connect", "connect", 6 ),
			new WordCombination( "google", "google", 6 ),
			new WordCombination( "live", "live", 6 ),
			new WordCombination( "myyoast", "myyoast", 6 ),
			new WordCombination( "site", "site", 6 ),
			new WordCombination( "update", "update", 6 ),
			new WordCombination( "work", "work", 6 ),
		];

		const words = getProminentWordsForInsights( paper, researcher );

		expect( words ).toEqual( expected );
	} );
} );
