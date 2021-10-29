import getWordForms from "../../../../../src/languageProcessing/languages/ja/customResearches/getWordForms";
import { Paper } from "../../../../../index";
import Researcher from "../../../../../src/languageProcessing/languages/ja/Researcher";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyData = getMorphologyData( "ja" );

describe( "The getWordForms function", () => {
	it( "creates word forms based on the word forms found in the paper.", () => {
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
			synonymForms: [],
		} );
	} );
	it( "creates word forms for an exact match keyphrase based on the word forms found in the paper.", () => {
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
			keyphraseForms: [ [ "頑張る", "頑張り", "頑張ら", "頑張れ", "頑張ろ", "頑張っ", "頑張れる", "頑張らせ", "頑張らせる", "頑張られ", "頑張られる", "頑張ろう" ] ],
			synonymForms: [],
		} );
	} );
	it( "creates word forms for synonyms based on the word forms found in the paper.", () => {
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
			synonymForms: [
				[ [ "休む", "休み", "休ま", "休め", "休も", "休ん", "休める", "休ませ", "休ませる", "休まれ", "休まれる", "休もう" ] ],
				[ [ "及ぶ", "及び", "及ば", "及べ", "及ぼ", "及ん", "及べる", "及ばせ", "及ばせる", "及ばれ", "及ばれる", "及ぼう" ] ],
			],
		} );
	} );
	it( "creates word forms for exact matching synonyms based on the word forms found in the paper.", () => {
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
			synonymForms: [
				[ [ "休む", "休み", "休ま", "休め", "休も", "休ん", "休める", "休ませ", "休ませる", "休まれ", "休まれる", "休もう" ] ],
				[ [ "及ぶ", "及び", "及ば", "及べ", "及ぼ", "及ん", "及べる", "及ばせ", "及ばせる", "及ばれ", "及ばれる", "及ぼう" ] ],
			],
		} );
	} );
} );
