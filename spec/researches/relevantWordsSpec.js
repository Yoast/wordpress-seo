import relevantWordsResearch from "../../src/researches/relevantWords";
import Paper from "../../src/values/Paper";
import Researcher from "../../src/researcher";
import WordCombination from "../../src/values/WordCombination";
import morphologyData from "../../premium-configuration/data/morphologyData.json";

describe( "relevantWords research", function() {
	it( "does not break if no morphology support is added for the language", function() {
		const paper = new Paper( "texte et texte", { locale: "fr_FR" } );

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const expected = [
			new WordCombination( "texte", "texte", 2 ),
		];

		const words = relevantWordsResearch( paper, researcher );

		expect( words ).toEqual( expected );
	} );

	it( "calls through to the string processing function", function() {
		const paper = new Paper( "Here are a ton of syllables. Syllables are very important. I think the syllable " +
			"combinations are even more important. Syllable combinations for the win!" );

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const expected = [
			new WordCombination( "syllable", "syllable", 4 ),
			new WordCombination( "combinations", "combination", 2 ),
		];

		const words = relevantWordsResearch( paper, researcher );

		expect( words ).toEqual( expected );
	} );

	it( "calls through to the string processing function", function() {
		const paper = new Paper( "As we announced at YoastCon, we’re working together with Bing and Google to allow live indexing for " +
			"everyone who uses Yoast SEO — free and premium. " +
			"<h2>Subheading!</h2>" +
			"In an update currently planned for the end of March, we’ll " +
			"allow users to connect their sites to MyYoast, our customer portal. After that we’ll roll out live indexing, " +
			"which means every time you publish, update, or delete a post, that will be reflected almost instantly into " +
			"Bing and Google’s indices. How does this work? When you connect your site to MyYoast...", {
			keyword: "live indexing Yoast SEO",
			synonyms: "live index",
			title: "Amazing title",
			description: "Awesome metadescription",
			locale: "en_EN",
		} );

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const expected = [
			new WordCombination( "index", "index", 6 ),
			new WordCombination( "live", "live", 6 ),
			new WordCombination( "amazing", "amaze", 3 ),
			new WordCombination( "keyphrase", "keyphrase", 3 ),
			new WordCombination( "metadescription", "metadescription", 3 ),
			new WordCombination( "subheading", "subhead", 3 ),
			new WordCombination( "title", "title", 3 ),
			new WordCombination( "allow", "allow", 2 ),
			new WordCombination( "bing", "bing", 2 ),
			new WordCombination( "connect", "connect", 2 ),
			new WordCombination( "google", "google", 2 ),

			new WordCombination( "myyoast", "myyoast", 2 ),
			new WordCombination( "site", "site", 2 ),
			new WordCombination( "update", "update", 2 ),
			new WordCombination( "work", "work", 2 ),
		];

		const words = relevantWordsResearch( paper, researcher );

		expect( words ).toEqual( expected );
	} );
} );
