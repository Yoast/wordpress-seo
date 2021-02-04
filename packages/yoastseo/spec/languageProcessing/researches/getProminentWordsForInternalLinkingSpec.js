import prominentWordsResearch from "../../../src/languageProcessing/researches/getProminentWordsForInternalLinking";
import Paper from "../../../src/values/Paper";
import Researcher from "../../../src/languageProcessing/languages/en/researcher";
import CatalanResearcher from "../../../src/languageProcessing/languages/ca/researcher";
import ProminentWord from "../../../src/values/ProminentWord";
import getMorphologyData from "../../specHelpers/getMorphologyData";


const morphologyData = getMorphologyData( "en" );

describe( "relevantWords research", function() {
	it( "returns no prominent words for texts under 100 words", function() {
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

	it( "returns prominent words for texts with more than 300 words", function() {
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

	it( "does not break if no morphology support is added for the language " +
		"and does not filter function words if the list is not available", function() {
		const paper = new Paper( "texte " + " et texte".repeat( 399 ), { locale: "ca" } );

		const researcher = new CatalanResearcher( paper );

		const expected = {
			prominentWords: [ new ProminentWord( "texte", "texte", 400 ), new ProminentWord( "et", "et", 399 ) ],
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

	it( "lowers the prominent words occurrence threshold if a language does not have morphology support (English in Free)", function() {
		const paper = new Paper( ( "Romeo and Juliet borrows from a tradition of tragic love stories dating back to antiquity. " +
								   "One of these is Pyramus and Thisbe, from Ovid's Metamorphoses, which contains parallels " +
								   "to Shakespeare's story: the lovers' parents despise each other, " +
								   "and Pyramus falsely believes his lover Thisbe is dead. " +
								   "The Ephesiaca of Xenophon of Ephesus, written in the 3rd century, also contains several similarities " +
								   "to the play, including the separation of the lovers, and a potion that induces a deathlike sleep." +
								   "One of the earliest references to the names Montague and Capulet is from Dante's Divine Comedy, " +
								   "who mentions the Montecchi (Montagues) and Capulets." +
								   "Romeo and Juliet. " +
								   "Romeo and Juliet. " +
								   "Romeo and Juliet. " ) );

		const researcher = new Researcher( paper );

		const expected = {
			prominentWords: [
				new ProminentWord( "juliet", "juliet", 4 ),
				new ProminentWord( "romeo", "romeo", 3 ),
				new ProminentWord( "lovers", "lovers", 2 ),
				new ProminentWord( "pyramus", "pyramus", 2 ),
				new ProminentWord( "thisbe", "thisbe", 2 ),
			],
			hasMetaDescription: false,
			hasTitle: false,
		};

		const words = prominentWordsResearch( paper, researcher );

		expect( words ).toEqual( expected );
	} );

	it( "sets the prominent words occurrence threshold to 4 if a language does have morphology support ", function() {
		const paper = new Paper( ( "Romeo and Juliet borrows from a tradition of tragic love stories dating back to antiquity. " +
								   "One of these is Pyramus and Thisbe, from Ovid's Metamorphoses, which contains parallels " +
								   "to Shakespeare's story: the lovers' parents despise each other, " +
								   "and Pyramus falsely believes his lover Thisbe is dead. " +
								   "The Ephesiaca of Xenophon of Ephesus, written in the 3rd century, also contains several similarities " +
								   "to the play, including the separation of the lovers, and a potion that induces a deathlike sleep." +
								   "One of the earliest references to the names Montague and Capulet is from Dante's Divine Comedy, " +
								   "who mentions the Montecchi (Montagues) and Capulets." +
								   "Romeo and Juliet. " +
								   "Romeo and Juliet. " +
								   "Romeo and Juliet. " ) );

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const expected = {
			prominentWords: [
				new ProminentWord( "juliet", "juliet", 4 ),
			],
			hasMetaDescription: false,
			hasTitle: false,
		};

		const words = prominentWordsResearch( paper, researcher );

		expect( words ).toEqual( expected );
	} );
} );
