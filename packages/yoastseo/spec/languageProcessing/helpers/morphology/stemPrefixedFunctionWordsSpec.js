import { stemPrefixedFunctionWords } from "../../../../src/languageProcessing/helpers/morphology/stemPrefixedFunctionWords";

describe( "A test for the stemPrefixedFunctionWords function", function() {
	it( "shouldn't break when the word input us empty", () => {
		const word = "";
		const regex = /test/;
		const result = stemPrefixedFunctionWords( word, regex );

		expect( result ).toEqual( { stem: "", prefix: "" } );
	} );
	it( "should return the stem and the prefix if the word was prefixed", () => {
		const word = "הפנדות";
		const regex = /^(ב|ה|ו|כ|ל|מ|ש)/;
		const result = stemPrefixedFunctionWords( word, regex );

		expect( result ).toEqual( { stem: "פנדות", prefix: "ה" } );
	} );
	it( "should return the original word as the stem and an empty string for the prefix if the word was not prefixed", () => {
		const word = "פנדות";
		const regex = /^(ב|ה|ו|כ|ל|מ|ש)/;
		const result = stemPrefixedFunctionWords( word, regex );

		expect( result ).toEqual( { stem: "פנדות", prefix: "" } );
	} );
} );
