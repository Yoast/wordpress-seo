/* global describe it expect */
import KeywordDensityAssessment from "../../js/assessments/seo/KeywordDensityAssessment";
const Paper = require( "../../js/values/Paper.js" );
const Mark = require( "../../js/values/Mark.js" );
const factory = require( "../helpers/factory.js" );
const i18n = factory.buildJed();

describe( "An assessment for the keywordDensity", function() {
	it( "runs the keywordDensity on the paper", function() {
		let paper = new Paper( "string without the key", { keyword: "keyword" } );
		let result = new KeywordDensityAssessment().getResult( paper, factory.buildMockResearcher( {
			getKeywordDensity: 0,
			keywordCount: {
				count: 0,
			},
		}, true ), i18n );
		expect( result.getScore() ).toBe( 4 );
		expect( result.getText() ).toBe( "The exact-match <a href='https://yoa.st/2pe' target='_blank'>keyword density</a> is 0%, which is too low; the focus keyword was found 0 times." );

		paper = new Paper( "string with the keyword", { keyword: "keyword" } );
		result = new KeywordDensityAssessment().getResult( paper, factory.buildMockResearcher( {
			getKeywordDensity: 0.1,
			keywordCount: {
				count: 1,
			},
		}, true ), i18n );
		expect( result.getScore() ).toBe( 4 );
		expect( result.getText() ).toBe( "The exact-match <a href='https://yoa.st/2pe' target='_blank'>keyword density</a> is 0.1%, which is too low; the focus keyword was found 1 time." );

		paper = new Paper( "string with the keyword", { keyword: "keyword" } );
		result = new KeywordDensityAssessment().getResult( paper, factory.buildMockResearcher( {
			getKeywordDensity: 10,
			keywordCount: {
				count: 1,
			},
		}, true ), i18n );
		expect( result.getScore() ).toBe( -50 );
		expect( result.getText() ).toBe( "The exact-match <a href='https://yoa.st/2pe' target='_blank'>keyword density</a> is 10%, which is way over the advised 2.5% maximum; the focus keyword was found 1 time." );

		paper = new Paper( "string with the keyword", { keyword: "keyword" } );
		result = new KeywordDensityAssessment().getResult( paper, factory.buildMockResearcher( {
			getKeywordDensity: 2,
			keywordCount: {
				count: 1,
			},
		}, true ), i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "The exact-match <a href='https://yoa.st/2pe' target='_blank'>keyword density</a> is 2%, which is great; the focus keyword was found 1 time." );

		paper = new Paper( "string with the keyword  and keyword ", { keyword: "keyword" } );
		result = new KeywordDensityAssessment().getResult( paper, factory.buildMockResearcher( {
			getKeywordDensity: 3,
			keywordCount: {
				count: 2,
			},
		}, true ), i18n );
		expect( result.getScore() ).toBe( -10 );
		expect( result.getText() ).toBe( "The exact-match <a href='https://yoa.st/2pe' target='_blank'>keyword density</a> is 3%, which is over the advised 2.5% maximum; the focus keyword was found 2 times." );

		paper = new Paper( "string with the keyword  and keyword ", { keyword: "keyword" } );
		result = new KeywordDensityAssessment().getResult( paper, factory.buildMockResearcher( {
			getKeywordDensity: 0.5,
			keywordCount: {
				count: 2,
			},
		}, true ), i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "The exact-match <a href='https://yoa.st/2pe' target='_blank'>keyword density</a> is 0.5%, which is great; the focus keyword was found 2 times." );
	} );
} );

describe( "A test for marking the keyword", function() {
	it( "returns markers", function() {
		const paper = new Paper( "This is a very interesting paper with a keyword and another keyword.", { keyword: "keyword" }  );
		const expected = [
			new Mark( {
				original: "This is a very interesting paper with a keyword and another keyword.",
				marked: "This is a very interesting paper with a <yoastmark class='yoast-text-mark'>keyword</yoastmark> and another <yoastmark class='yoast-text-mark'>keyword</yoastmark>.",
			} ),
		];
		expect( new KeywordDensityAssessment().getMarks( paper ) ).toEqual( expected );
	} );

	it( "doesn't return markers for synonyms", function() {
		const paper = new Paper( "This is a very interesting paper with a keyword and another keyword and a synonym.", { keyword: "keyword", synonyms: "synonym" }  );
		const expected = [
			new Mark( {
				original: "This is a very interesting paper with a keyword and another keyword and a synonym.",
				marked: "This is a very interesting paper with a <yoastmark class='yoast-text-mark'>keyword</yoastmark> and another <yoastmark class='yoast-text-mark'>keyword</yoastmark> and a synonym.",
			} ),
		];
		expect( new KeywordDensityAssessment().getMarks( paper ) ).toEqual( expected );
	} );

	it( "returns no markers", function() {
		const paper = new Paper( "This is a very interesting paper with a keyword and other keywords.", { keyword: "seaside" }  );
		const expected = [];
		expect( new KeywordDensityAssessment().getMarks( paper ) ).toEqual( expected );
	} );
} );
