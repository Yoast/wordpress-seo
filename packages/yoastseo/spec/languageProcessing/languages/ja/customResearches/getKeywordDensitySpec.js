import getKeywordDensity from "../../../../../src/languageProcessing/languages/ja/customResearches/getKeywordDensity";
import Paper from "../../../../../src/values/Paper.js";
import factory from "../../../../specHelpers/factory";
import getStemmer from "../../../../../src/languageProcessing/languages/ja/helpers/getStemmer";

/**
 * Mocks Japanese Researcher.
 * @param {Object} keywordCountObject The keywordCountObject to be added to the researcher.
 * @param {function} helper A helper needed for the assesment.
 *
 * @returns {Researcher} The mock researcher with added morphological forms and custom helper.
 */
const buildJapaneseMockResearcher = function( keywordCountObject, helper ) {
	return factory.buildMockResearcher( {
		keywordCount: keywordCountObject,
	},
	true,
	true,
	false,
	{
		getStemmer: helper,
	} );
};

describe( "test for calculating the Japanese keyword density", function() {
	it( "returns the keyword density when the keyword is found once", function() {
		const mockPaper = new Paper( "私の猫はかわいいです。", { keyword: "猫" } );
		const keywordCountObject = {
			count: 1,
			matches: [ "猫" ],
			charactersCount: 1,
		};
		const mockResearcher = buildJapaneseMockResearcher( keywordCountObject, getStemmer );
		expect( getKeywordDensity( mockPaper, mockResearcher ).keywordDensity ).toBe( 9.090909090909092 );
	} );

	it( "returns the keyword density when the keyword contains multiple words", function() {
		const mockPaper = new Paper( "私の猫はかわいいです。" );
		const keywordCountObject = {
			count: 1,
			matches: [ "猫", "かわいい" ],
			charactersCount: 5,
		};
		const mockResearcher = buildJapaneseMockResearcher( keywordCountObject, getStemmer );
		expect( getKeywordDensity( mockPaper, mockResearcher ).keywordDensity ).toBe( 45.45454545454545 );
	} );

	it( "returns 0 when the text is empty", function() {
		const mockPaper = new Paper( "" );
		const keywordCountObject = {
			count: 1,
			matches: [ "猫", "かわいい" ],
			charactersCount: 5,
		};
		const mockResearcher = buildJapaneseMockResearcher( keywordCountObject, getStemmer );
		expect( getKeywordDensity( mockPaper, mockResearcher ) ).toBe( 0 );
	} );
} );
