import getProminentWordsForInsights from "../../src/languages/legacy/researches/getProminentWordsForInsights";
import Paper from "../../src/values/Paper";
import Researcher from "../../src/researcher";
import ProminentWord from "../../src/values/ProminentWord";
import getMorphologyData from "../specHelpers/getMorphologyData";


const morphologyData = getMorphologyData( "en" );

describe( "getProminentWordsForInsights research", function() {
	it( "does not break if no morphology support is added for the language", function() {
		const paper = new Paper( "texte  et texte et texte et texte et texte", { locale: "fr_FR" } );

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const expected = [
			new ProminentWord( "texte", "texte", 5 ),
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
			new ProminentWord( "syllable", "syllable", 9 ),
			new ProminentWord( "combinations", "combination", 5 ),
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
			new ProminentWord( "indexing", "index", 9 ),
			new ProminentWord( "allow", "allow", 6 ),
			new ProminentWord( "bing", "bing", 6 ),
			new ProminentWord( "connect", "connect", 6 ),
			new ProminentWord( "google", "google", 6 ),
			new ProminentWord( "live", "live", 6 ),
			new ProminentWord( "myyoast", "myyoast", 6 ),
			new ProminentWord( "site", "site", 6 ),
			new ProminentWord( "update", "update", 6 ),
			new ProminentWord( "work", "work", 6 ),
		];

		const words = getProminentWordsForInsights( paper, researcher );

		expect( words ).toEqual( expected );
	} );
} );
