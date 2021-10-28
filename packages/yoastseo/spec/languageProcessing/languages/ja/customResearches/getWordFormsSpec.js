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
			keyphraseForms: [ [ "休ま", "休め" ] ],
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
			keyphraseForms: [ [ "頑張ら", "頑張り" ] ],
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
			keyphraseForms: [ [ "話せる", "話さ" ] ],
			synonymForms: [
				[ [ "休め" ] ],
				[ [ "及ん", "及ぼ" ] ],
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
			keyphraseForms: [ [ "話せる", "話さ" ] ],
			synonymForms: [
				[ [ "休め" ] ],
				[ [ "及ん", "及ぼ" ] ],
			],
		} );
	} );
} );
