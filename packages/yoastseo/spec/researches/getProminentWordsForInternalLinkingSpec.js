import prominentWordsResearch from "../../src/researches/getProminentWordsForInternalLinking";
import Paper from "../../src/values/Paper";
import Researcher from "../../src/researcher";
import ProminentWord from "../../src/values/ProminentWord";
import getMorphologyData from "../specHelpers/getMorphologyData";


const morphologyData = getMorphologyData( "en" );

describe( "relevantWords research", function() {
	it( "returns no prominent words for texts under 300 words", function() {
		const paper = new Paper( "texte et texte et texte et texte" );

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const expected = {
			prominentWords: [],
			hasMetaDescription: false,
			hasTitle: false,
		};

		const words = prominentWordsResearch( paper, researcher );

		expect( words ).toEqual( expected );
	} );

	it( "returns no prominent words for texts between 300 and 400 words without title and metadescription", function() {
		const paper = new Paper( "texte" + " et texte".repeat( 180 ) );

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const expected = {
			prominentWords: [],
			hasMetaDescription: false,
			hasTitle: false,
		};

		const words = prominentWordsResearch( paper, researcher );

		expect( words ).toEqual( expected );
	} );

	it( "does return prominent words for texts between 300 and 400 words with a title", function() {
		const paper = new Paper( "texte" + " et texte".repeat( 180 ), { title: "Title" } );

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const expected = {
			prominentWords: [
				new ProminentWord( "texte", "texte", 181 ),
				new ProminentWord( "et", "et", 180 ),
			],
			hasMetaDescription: false,
			hasTitle: true,
		};

		const words = prominentWordsResearch( paper, researcher );

		expect( words ).toEqual( expected );
	} );

	it( "does not break if no morphology support is added for the language", function() {
		const paper = new Paper( "texte " + " et texte".repeat( 399 ), { locale: "fr_FR" } );

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const expected = {
			prominentWords: [ new ProminentWord( "texte", "texte", 400 ) ],
			hasMetaDescription: false,
			hasTitle: false,
		};

		const words = prominentWordsResearch( paper, researcher );

		expect( words ).toEqual( expected );
	} );

	it( "returns relevant words from the text alone if no attributes are available", function() {
		const paper = new Paper( ( "Here are a ton of syllables. Syllables are very important. I think the syllable " +
			"combinations are even more important. Syllable combinations for the win! Combinations are awesome. " +
			"So many combinations! " ).repeat( 15 ) );

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const expected = {
			prominentWords: [
				new ProminentWord( "combinations", "combination", 60 ),
				new ProminentWord( "syllable", "syllable", 60 ),
				new ProminentWord( "win", "win", 15 ),
			],
			hasMetaDescription: false,
			hasTitle: false,
		};

		const words = prominentWordsResearch( paper, researcher );

		expect( words ).toEqual( expected );
	} );

	it( "combines data from the text and from the paper attributes", function() {
		const paper = new Paper( ( "As we announced at YoastCon, we’re working together with Bing and Google to allow live indexing for " +
			"everyone who uses Yoast SEO — free and premium. " +
			"<h2>Subheading!</h2>" +
			"In an update currently planned for the end of March, we’ll " +
			"allow users to connect their sites to MyYoast, our customer portal. After that we’ll roll out live indexing, " +
			"which means every time you publish, update, or delete a post, that will be reflected almost instantly into " +
			"Bing and Google’s indices. How does this work? When you connect your site to MyYoast... " ).repeat( 6 ), {
			keyword: "live indexing Yoast SEO",
			synonyms: "live index",
			title: "Amazing title",
			description: "Awesome metadescription",
			locale: "en_EN",
		} );

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		/*
		 *  The research considers relevant words coming from paper attributes 3 times more important than those coming
		 *  from the text of the paper. Therefore, the final number of occurrences can be calculated as
		 *  number_of_occurrences_in_text + 3 * number_of_occurrences_in_paper_attributes.
		 */
		const expected = {
			prominentWords: [
				/*
				*  The stem "index" occurs 18 times in the text ("indexing", "indexing" and "indices") and 2 times in the
				*  attributes ("indexing" and "index"): 18 + 2 * 3 = 24
				*/
				new ProminentWord( "index", "index", 24 ),
				new ProminentWord( "live", "live", 18 ),
				new ProminentWord( "subheading", "subhead", 18 ),
				new ProminentWord( "allow", "allow", 12 ),
				new ProminentWord( "bing", "bing", 12 ),
				new ProminentWord( "connect", "connect", 12 ),
				new ProminentWord( "google", "google", 12 ),
				new ProminentWord( "myyoast", "myyoast", 12 ),
				new ProminentWord( "site", "site", 12 ),
				new ProminentWord( "update", "update", 12 ),
				new ProminentWord( "work", "work", 12 ),
				new ProminentWord( "SEO", "seo", 9 ),
				new ProminentWord( "yoast", "yoast", 9 ),
				new ProminentWord( "customer", "custome", 6 ),
				new ProminentWord( "delete", "delete", 6 ),
				new ProminentWord( "end", "end", 6 ),
				new ProminentWord( "free", "free", 6 ),
				new ProminentWord( "march", "march", 6 ),
				new ProminentWord( "planned", "plan", 6 ),
				new ProminentWord( "portal", "portal", 6 ),
				new ProminentWord( "post", "post", 6 ),
				new ProminentWord( "premium", "premium", 6 ),
				new ProminentWord( "publish", "publish", 6 ),
				new ProminentWord( "reflected", "reflect", 6 ),
				new ProminentWord( "roll", "roll", 6 ),
				new ProminentWord( "time", "time", 6 ),
				new ProminentWord( "together", "together", 6 ),
				new ProminentWord( "uses", "use", 6 ),
				new ProminentWord( "users", "user", 6 ),
				new ProminentWord( "yoastcon", "yoastcon", 6 ),
			],
			hasMetaDescription: true,
			hasTitle: true,
		};

		const words = prominentWordsResearch( paper, researcher );

		expect( words ).toEqual( expected );
	} );
} );
