import getWordForms from "../../../../../src/languageProcessing/languages/ja/customResearches/getWordForms";
import { Paper } from "../../../../../index";
import Researcher from "../../../../../src/languageProcessing/languages/ja/Researcher";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyData = getMorphologyData( "ja" );

describe( "The getWordForms function", () => {
	it( "creates word forms for a Japanese keyphrase that contains spaces", () => {
		const paper = new Paper(
			"休ま",
			{
				keyword: "かしら かい を ばっかり",
			}
		);

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const forms = getWordForms( paper, researcher );
		expect( forms ).toEqual( {
			keyphraseForms: [ [ "かしらかう", "かしらかい", "かしらかわ", "かしらかえ", "かしらかお", "かしらかっ", "かしらかえる", "かしらかわせ",
				"かしらかわせる", "かしらかわれ", "かしらかわれる", "かしらかおう", "かしらかく", "かしらかき", "かしらかか", "かしらかけ",
				"かしらかこ", "かしらかける", "かしらかかせ", "かしらかかせる", "かしらかかれ", "かしらかかれる", "かしらかこう", "かしらかかっ",
				"かしらかぐ", "かしらかぎ", "かしらかが", "かしらかげ", "かしらかご", "かしらかげる", "かしらかがせ", "かしらかがせる", "かしらかがれ",
				"かしらかがれる", "かしらかごう" ] ],
			synonymsForms: [],
		} );
	} );
	it( "creates word forms for a Japanese keyphrase.", () => {
		const paper = new Paper(
			"休ま",
			{
				keyword: "休め",
			}
		);

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const forms = getWordForms( paper, researcher );
		expect( forms ).toEqual( {
			keyphraseForms: [ [ "休む", "休み", "休ま", "休め", "休も", "休ん", "休める", "休ませ", "休ませる", "休まれ", "休まれる", "休もう" ] ],
			synonymsForms: [],
		} );
	} );
	it( "returns empty structure if no keyword or synonyms are supplied.", () => {
		const paper = new Paper(
			"休ま",
			{
				keyword: "",
				synonyms: "",
			}
		);

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const forms = getWordForms( paper, researcher );
		expect( forms ).toEqual( {
			keyphraseForms: [],
			synonymsForms: [],
		} );
	} );
	it( "returns an empty keyphrase field if only synonyms are supplied.", () => {
		const paper = new Paper(
			"休ま",
			{
				keyword: "",
				synonyms: "休め",
			}
		);

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const forms = getWordForms( paper, researcher );
		expect( forms ).toEqual( {
			keyphraseForms: [],
			synonymsForms: [ [ [ "休む", "休み", "休ま", "休め", "休も", "休ん", "休める", "休ませ", "休ませる", "休まれ", "休まれる", "休もう" ] ] ],
		} );
	} );
	it( "returns the exact match of a Japanese keyphrase using double quotation marks.", () => {
		const paper = new Paper(
			"休ま",
			{
				keyword: "\"休め\"",
			}
		);

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const forms = getWordForms( paper, researcher );
		expect( forms ).toEqual( {
			keyphraseForms: [ [ "休め" ] ],
			synonymsForms: [],
		} );
	} );
	it( "returns the exact match of a Japanese keyphrase using Japanese-specific quotation marks.", () => {
		const paper = new Paper(
			"頑張ら",
			{
				keyword: "「頑張り」",
			}
		);

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const forms = getWordForms( paper, researcher );
		expect( forms ).toEqual( {
			keyphraseForms: [ [ "頑張り" ] ],
			synonymsForms: [],
		} );
	} );
	it( "creates word forms for Japanese keyphrase and synonyms.", () => {
		const paper = new Paper(
			"話せる及ん",
			{
				keyword: "話さ",
				synonyms: "休め, 及ぼ",
			}
		);

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const forms = getWordForms( paper, researcher );
		expect( forms ).toEqual( {
			keyphraseForms: [ [ "話す", "話し", "話さ", "話せ", "話そ", "話せる", "話させ", "話させる", "話され", "話される", "話そう" ] ],
			synonymsForms: [
				[ [ "休む", "休み", "休ま", "休め", "休も", "休ん", "休める", "休ませ", "休ませる", "休まれ", "休まれる", "休もう" ] ],
				[ [ "及ぶ", "及び", "及ば", "及べ", "及ぼ", "及ん", "及べる", "及ばせ", "及ばせる", "及ばれ", "及ばれる", "及ぼう" ] ],
			],
		} );
	} );
	it( "creates word forms for Japanese keyphrase and synonyms, where one of the synonyms requires exact match.", () => {
		const paper = new Paper(
			"話せる及ん",
			{
				keyword: "話さ",
				synonyms: "『休め』, 及ぼ",
			}
		);

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		const forms = getWordForms( paper, researcher );
		expect( forms ).toEqual( {
			keyphraseForms: [ [ "話す", "話し", "話さ", "話せ", "話そ", "話せる", "話させ", "話させる", "話され", "話される", "話そう" ] ],
			synonymsForms: [
				[ [ "休め" ] ],
				[ [ "及ぶ", "及び", "及ば", "及べ", "及ぼ", "及ん", "及べる", "及ばせ", "及ばせる", "及ばれ", "及ばれる", "及ぼう" ] ],
			],
		} );
	} );
	it( "creates forms for a Japanese keyphrase consisting of multiple words.", () => {
		const paper = new Paper(
			"犬です。",
			{
				/*
				 * 猫 - one character noun, no forms required
				 * が - function word, is deleted
				 * 遊んでいる - verb, forms are created
				 */
				keyword: "猫が遊んでいる",
				synonyms: "",
			}
		);

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const forms = getWordForms( paper, researcher );
		expect( forms ).toEqual( {
			keyphraseForms:
				[ [ "猫" ],
					[ "遊ぬ", "遊に", "遊な", "遊ね", "遊の", "遊ん", "遊ねる", "遊なせ", "遊なせる",
						"遊なれ", "遊なれる", "遊のう", "遊む", "遊み", "遊ま", "遊め", "遊も",
						"遊める", "遊ませ", "遊ませる", "遊まれ", "遊まれる", "遊もう", "遊ぶ",
						"遊び", "遊ば", "遊べ", "遊ぼ", "遊べる", "遊ばせ", "遊ばせる",
						"遊ばれ", "遊ばれる", "遊ぼう" ] ],
			synonymsForms: [],
		} );
	} );
	it( "creates forms for a Japanese keyphrase consisting of multiple words separated by spaces.", () => {
		const paper = new Paper(
			"文章です。",
			{
				/*
				 * レシピ - noun, no forms required
				 * 美味しい - adjective, forms are created
				 */
				keyword: "レシピ　美味しい",
				synonyms: "",
			}
		);

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const forms = getWordForms( paper, researcher );
		expect( forms ).toEqual( {
			keyphraseForms:
				[ [ "レシピ" ],
					[ "美味しう",
						"美味しい",
						"美味しわ",
						"美味しえ",
						"美味しお",
						"美味しっ",
						"美味しえる",
						"美味しわせ",
						"美味しわせる",
						"美味しわれ",
						"美味しわれる",
						"美味しおう",
						"美味しく",
						"美味しき",
						"美味しか",
						"美味しけ",
						"美味しこ",
						"美味しける",
						"美味しかせ",
						"美味しかせる",
						"美味しかれ",
						"美味しかれる",
						"美味しこう",
						"美味しかっ",
						"美味しぐ",
						"美味しぎ",
						"美味しが",
						"美味しげ",
						"美味しご",
						"美味しげる",
						"美味しがせ",
						"美味しがせる",
						"美味しがれ",
						"美味しがれる",
						"美味しごう" ] ],
			synonymsForms: [],
		} );
	} );
	it( "returns the keyphrase and synonyms unaltered when we have a stemmer," +
		"and function word support, but no morphology data is available (e.g., in Free)", () => {
		const paper = new Paper(
			"話せる及ん",
			{
				keyword: "話さ",
				synonyms: "及ぼ",
			}
		);

		const researcher = new Researcher( paper );
		const forms = getWordForms( paper, researcher );
		expect( forms ).toEqual( {
			keyphraseForms: [ [ "話さ" ] ],
			synonymsForms: [ [ [ "及ぼ" ] ] ],
		} );
	} );
	it( "a test to make sure that createWordForms is not accessed when there is no morpohlogyData file available (using a word that ends in る)", () => {
		const paper = new Paper(
			"話せる及ん",
			{
				keyword: "話さる",
				synonyms: "及ぼ",
			}
		);

		const researcher = new Researcher( paper );
		const forms = getWordForms( paper, researcher );
		expect( forms ).toEqual( {
			keyphraseForms: [ [ "話さる" ] ],
			synonymsForms: [ [ [ "及ぼ" ] ] ],
		} );
	} );
	it( "creates forms for a Japanese keyphrase consisting of multiple words, including function words, when no morphologyData file is available.", () => {
		const paper = new Paper(
			"犬です。",
			{
				/*
				 * 猫 - one character noun, no forms required
				 * が - function word, is deleted
				 * 及ぼ - verb, forms would be created in Premium, but not Free
				 */
				keyword: "猫が及ぼ",
				synonyms: "",
			}
		);

		const researcher = new Researcher( paper );
		const forms = getWordForms( paper, researcher );
		expect( forms ).toEqual( {
			keyphraseForms:
				[ [ "猫" ],
					[ "及ぼ" ] ],
			synonymsForms: [],
		} );
	} );
} );
