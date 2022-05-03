import prominentWordsResearch from "../../../src/languageProcessing/researches/getProminentWordsForInternalLinking";
import Paper from "../../../src/values/Paper";
import Researcher from "../../../src/languageProcessing/languages/en/Researcher";
import CatalanResearcher from "../../../src/languageProcessing/languages/ca/Researcher";
import JapaneseResearcher from "../../../src/languageProcessing/languages/ja/Researcher";
import ProminentWord from "../../../src/languageProcessing/values/ProminentWord";
import getMorphologyData from "../../specHelpers/getMorphologyData";


const morphologyData = getMorphologyData( "en" );
const morphologyDataJA = getMorphologyData( "ja" );

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

describe( "test for prominent words research for languages that have custom helpers", function() {
	// Japanese has custom helpers for getting words from the text, for counting text length
	// And for returning custom function to return the stem of a word.
	it( "returns no prominent words for texts under 200 characters", function() {
		const paper = new Paper( "東海道新幹線の開業前、東西の大動脈である東海道本線は高度経済成長下で線路容量が逼迫しており、抜本的な輸送力増強を迫られていた。" );

		const researcher = new JapaneseResearcher( paper );
		researcher.addResearchData( "morphology", morphologyDataJA );

		const expected = {
			prominentWords: [],
			hasMetaDescription: false,
			hasTitle: false,
		};

		const words = prominentWordsResearch( paper, researcher );

		expect( words ).toEqual( expected );
	} );

	it( "returns prominent words for texts with more than 300 words, in which the morphology data is available", function() {
		const paper = new Paper( "私の美しい猫" + "の美しい猫".repeat( 180 ), { title: "題名" } );

		const researcher = new JapaneseResearcher( paper );
		researcher.addResearchData( "morphology", morphologyDataJA );

		const expected = {
			prominentWords: [
				new ProminentWord( "猫", "猫", 181 ),
				new ProminentWord( "美しい", "美しい", 181 ),
			],
			hasMetaDescription: false,
			hasTitle: true,
		};

		const words = prominentWordsResearch( paper, researcher );

		expect( words ).toEqual( expected );
	} );

	it( "returns relevant words from the text alone if no attributes are available", function() {
		const paper = new Paper( ( "私の甘い猫は愛撫されるのが大好きです。猫はおやつが大好きです。" ).repeat( 100 ) );

		const researcher = new JapaneseResearcher( paper );
		researcher.addResearchData( "morphology", morphologyDataJA );

		const expected = {
			prominentWords: [
				new ProminentWord( "大好き", "大好い", 200 ),
				new ProminentWord( "おやつが", "おやつい", 100 ),
				new ProminentWord( "愛撫", "愛撫", 100 ),
				new ProminentWord( "猫", "猫", 100 ),
				new ProminentWord( "甘い猫", "甘い猫", 100 ),
			],
			hasMetaDescription: false,
			hasTitle: false,
		};

		const words = prominentWordsResearch( paper, researcher );

		expect( words ).toEqual( expected );
	} );

	it( "combines data from the text and from the paper attributes", function() {
		const paper = new Paper( ( "ネコ（猫）は、狭義には食肉目ネコ科ネコ属に分類されるリビアヤマネコ（ヨーロッパヤマネコ）が家畜化されたイエネコ（家猫、Felis silvestris catus）" +
			"に対する通称である。イヌ（犬）と並ぶ代表的なペットとして日本を含め世界中で広く飼われている。より広義には、ヤマネコやネコ科動物全般を指すこともある（後述）。" +
			"<h2>猫の種類</h2>" +
			"と同様、トラやライオンなどといった大型種を含む全てのネコ科動物を指すことがある。以下、本項では特記なき限りネコ=イエネコとして解説する。" ).repeat( 6 ), {
			keyword: "猫の種類",
			synonyms: "猫は繁殖します",
			title: "猫とその種類",
			description: "イエネコは、形態学的分析を主とする伝統的な生物学的知見によって、以前からヨーロッパヤマネコの亜種リビアヤマネコ Felis silvestris lybicaが原種とされてきた。" +
				"20世紀後半から発展した分子系統学などによる新たな知見も、従来説を裏付ける形となった。",
			locale: "ja",
		} );

		const researcher = new JapaneseResearcher( paper );
		researcher.addResearchData( "morphology", morphologyDataJA );

		const expected = {
			prominentWords: [
				new ProminentWord( "猫", "猫", 33 ),
				new ProminentWord( "ネコ", "ネコ", 30 ),
				new ProminentWord( "種類", "種類", 24 ),
				new ProminentWord( "イエネコ", "イエネコ", 15 ),
				new ProminentWord( "として", "とした", 12 ),
				new ProminentWord( "指す", "指さ", 12 ),
				new ProminentWord( "felis", "felis", 9 ),
				new ProminentWord( "silvestris", "silvestris", 9 ),
				new ProminentWord( "ヨーロッパヤマネコ", "ヨーロッパヤマネコ", 9 ),
				new ProminentWord( "リビアヤマネコ", "リビアヤマネコ", 9 ),
				new ProminentWord( "catus", "catus", 6 ),
				new ProminentWord( "いっ", "いい", 6 ),
				new ProminentWord( "イヌ", "イヌ", 6 ),
				new ProminentWord( "トラ", "トラ", 6 ),
				new ProminentWord( "なき", "ない", 6 ),
				new ProminentWord( "ペット", "ペット", 6 ),
				new ProminentWord( "ヤマネコ", "ヤマネコ", 6 ),
				new ProminentWord( "ライオン", "ライオン", 6 ),
				new ProminentWord( "世界", "世界", 6 ),
				new ProminentWord( "並ぶ", "並ば", 6 ),
				new ProminentWord( "代表", "代表", 6 ),
				new ProminentWord( "以下", "以下", 6 ),
				new ProminentWord( "分類", "分類", 6 ),
				new ProminentWord( "化", "化", 6 ),
				new ProminentWord( "同様", "同様", 6 ),
				new ProminentWord( "含め", "含ま", 6 ),
				new ProminentWord( "含む全て", "含む全た", 6 ),
				new ProminentWord( "大型", "大型", 6 ),
				new ProminentWord( "家猫", "家猫", 6 ),
				new ProminentWord( "家畜", "家畜", 6 ),
				new ProminentWord( "属", "属", 6 ),
				new ProminentWord( "広く", "広い", 6 ),
				new ProminentWord( "広義", "広義", 6 ),
				new ProminentWord( "後述", "後述", 6 ),
				new ProminentWord( "日本", "日本", 6 ),
				new ProminentWord( "本項", "本項", 6 ),
				new ProminentWord( "物全", "物全", 6 ),
				new ProminentWord( "特記", "特記", 6 ),
				new ProminentWord( "犬", "犬", 6 ),
				new ProminentWord( "狭義", "狭義", 6 ),
				new ProminentWord( "目", "目", 6 ),
				new ProminentWord( "知見", "知見", 6 ),
				new ProminentWord( "科ネコ", "科ネコ", 6 ),
				new ProminentWord( "科動", "科動", 6 ),
				new ProminentWord( "科動物", "科動物", 6 ),
				new ProminentWord( "種", "種", 6 ),
				new ProminentWord( "般", "般", 6 ),
				new ProminentWord( "解説", "解説", 6 ),
				new ProminentWord( "通称", "通称", 6 ),
				new ProminentWord( "限り", "限っ", 6 ),
				new ProminentWord( "食肉", "食肉", 6 ),
				new ProminentWord( "飼わ", "飼い", 6 ),
			],
			hasMetaDescription: true,
			hasTitle: true,
		};

		const words = prominentWordsResearch( paper, researcher );

		expect( words ).toEqual( expected );
	} );

	it( "returns prominent words for texts with more than 300 words, in which the morphology data is not available", function() {
		const paper = new Paper( "私の美しい猫" + "の美しい猫".repeat( 180 ), { title: "題名" } );

		const researcher = new JapaneseResearcher( paper );

		const expected = {
			prominentWords: [
				new ProminentWord( "猫", "猫", 181 ),
				new ProminentWord( "美しい", "美しい", 181 ),
				new ProminentWord( "題名", "題名", 3 ),
			],
			hasMetaDescription: false,
			hasTitle: true,
		};

		const words = prominentWordsResearch( paper, researcher );

		expect( words ).toEqual( expected );
	} );
} );

