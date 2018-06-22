/* global describe it expect */
const keywordDensityAssessment = require( "../../js/assessments/seo/keywordDensityAssessment.js" );
const Paper = require( "../../js/values/Paper.js" );

const factory = require( "../helpers/factory.js" );
const i18n = factory.buildJed();

describe( "An assessment for the keywordDensity", function() {
	it( "runs the keywordDensity on the paper", function() {
		let paper = new Paper( "string without the key", { keyword: "keyword" } );
		let result = keywordDensityAssessment.getResult( paper, factory.buildMockResearcher( {
			getKeywordDensity: 0,
			keywordCount: 0,
		}, true ), i18n );
		expect( result.getScore() ).toBe( 4 );
		expect( result.getText() ).toBe( "The keyword density is 0%, which is too low; the focus keyword was found 0 times." );

		paper = new Paper( "string with the keyword", { keyword: "keyword" } );
		result = keywordDensityAssessment.getResult( paper, factory.buildMockResearcher( {
			getKeywordDensity: 0.1,
			keywordCount: 1,
		}, true ), i18n );
		expect( result.getScore() ).toBe( 4 );
		expect( result.getText() ).toBe( "The keyword density is 0.1%, which is too low; the focus keyword was found 1 time." );

		paper = new Paper( "string with the keyword", { keyword: "keyword" } );
		result = keywordDensityAssessment.getResult( paper, factory.buildMockResearcher( {
			getKeywordDensity: 10,
			keywordCount: 1,
		}, true ), i18n );
		expect( result.getScore() ).toBe( -50 );
		expect( result.getText() ).toBe( "The keyword density is 10%, which is way over the advised 2.5% maximum; the focus keyword was found 1 time." );

		paper = new Paper( "string with the keyword", { keyword: "keyword" } );
		result = keywordDensityAssessment.getResult( paper, factory.buildMockResearcher( {
			getKeywordDensity: 2,
			keywordCount: 1,
		}, true ), i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "The keyword density is 2%, which is great; the focus keyword was found 1 time." );

		paper = new Paper( "string with the keyword  and keyword ", { keyword: "keyword" } );
		result = keywordDensityAssessment.getResult( paper, factory.buildMockResearcher( {
			getKeywordDensity: 3,
			keywordCount: 2,
		}, true ), i18n );
		expect( result.getScore() ).toBe( -10 );
		expect( result.getText() ).toBe( "The keyword density is 3%, which is over the advised 2.5% maximum; the focus keyword was found 2 times." );

		paper = new Paper( "string with the keyword  and keyword ", { keyword: "keyword" } );
		result = keywordDensityAssessment.getResult( paper, factory.buildMockResearcher( {
			getKeywordDensity: 0.5,
			keywordCount: 2,
		}, true ), i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "The keyword density is 0.5%, which is great; the focus keyword was found 2 times." );
	} );
} );
