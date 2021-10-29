import Researcher from "../../../../../src/languageProcessing/languages/it/Researcher";
import getStemmer from "../../../../../src/languageProcessing/languages/ja/helpers/getStemmer";
import Paper from "../../../../../src/values/Paper";
import { languageProcessing } from "yoastseo";
const { baseStemmer } = languageProcessing;

const paper = new Paper(  "これは日本語のテキストです。", { keyword: "日本語のテキスト", locale: "ja" }  );

describe( "Test for getting the helper to create a stemmer", () => {
	it( "returns the base stemmer", function() {
		const mockResearcher = new Researcher( paper );
		expect( getStemmer( mockResearcher ) ).toEqual( baseStemmer );
	} );
} );
