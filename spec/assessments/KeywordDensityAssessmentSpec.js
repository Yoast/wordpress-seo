/* global describe it expect */
import KeywordDensityAssessment from "../../src/assessments/seo/KeywordDensityAssessment";
import Paper from "../../src/values/Paper.js";
import Mark from "../../src/values/Mark.js";
import factory from "../specHelpers/factory.js";
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
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 0%. This is too low; the keyphrase was found 0 times. <a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!" );

		paper = new Paper( "string with the keyword", { keyword: "keyword" } );
		result = new KeywordDensityAssessment().getResult( paper, factory.buildMockResearcher( {
			getKeywordDensity: 0.1,
			keywordCount: {
				count: 1,
			},
		}, true ), i18n );
		expect( result.getScore() ).toBe( 4 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 0.1%. This is too low; the keyphrase was found 1 time. <a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!" );

		paper = new Paper( "string with the keyword", { keyword: "keyword" } );
		result = new KeywordDensityAssessment().getResult( paper, factory.buildMockResearcher( {
			getKeywordDensity: 10,
			keywordCount: {
				count: 1,
			},
		}, true ), i18n );
		expect( result.getScore() ).toBe( -50 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 10%. This is way over the advised 2.5% maximum; the keyphrase was found 1 time. <a href='https://yoa.st/33w' target='_blank'>Don't overoptimize</a>!" );

		paper = new Paper( "string with the keyword", { keyword: "keyword" } );
		result = new KeywordDensityAssessment().getResult( paper, factory.buildMockResearcher( {
			getKeywordDensity: 2,
			keywordCount: {
				count: 1,
			},
		}, true ), i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 2%. This is great!" );

		paper = new Paper( "string with the keyword  and keyword ", { keyword: "keyword" } );
		result = new KeywordDensityAssessment().getResult( paper, factory.buildMockResearcher( {
			getKeywordDensity: 3,
			keywordCount: {
				count: 2,
			},
		}, true ), i18n );
		expect( result.getScore() ).toBe( -10 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 3%. This is over the advised 2.5% maximum; the keyphrase was found 2 times. <a href='https://yoa.st/33w' target='_blank'>Don't overoptimize</a>!" );

		paper = new Paper( "string with the keyword  and keyword ", { keyword: "keyword" } );
		result = new KeywordDensityAssessment().getResult( paper, factory.buildMockResearcher( {
			getKeywordDensity: 0.5,
			keywordCount: {
				count: 2,
			},
		}, true ), i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 0.5%. This is great!" );
	} );
} );

describe( "A test for marking the keyword", function() {
	const keywordDensityAssessment = new KeywordDensityAssessment();

	it( "returns markers", function() {
		const mockPaper = new Paper( "This is a very interesting paper with a keyword and another keyword.", { keyword: "keyword" }  );
		keywordDensityAssessment.getResult( mockPaper, factory.buildMockResearcher( {
			getKeywordDensity: 0.5,
			keywordCount: {
				count: 2,
				markings: [ new Mark( { marked: "This is a very interesting paper with a <yoastmark class='yoast-text-mark'>keyword</yoastmark> and another <yoastmark class='yoast-text-mark'>keyword</yoastmark>.",
					original: "This is a very interesting paper with a keyword and another keyword." } ) ],
			},
		}, true ),
		i18n );
		const expected = [
			new Mark( { marked: "This is a very interesting paper with a <yoastmark class='yoast-text-mark'>keyword</yoastmark> and another <yoastmark class='yoast-text-mark'>keyword</yoastmark>.",
				original: "This is a very interesting paper with a keyword and another keyword." } ) ];
		expect( keywordDensityAssessment.getMarks() ).toEqual( expected );
	} );
} );

describe( "An assessment for keywordDensity when morphology data is available.", function() {
	it( "gives a GOOD result when keyword density is 3.0%", function() {
		const paper = new Paper( "string with the keyword  and keyword ", { keyword: "keyword" } );
		const result = new KeywordDensityAssessment().getResult( paper, factory.buildMockResearcher( {
			getKeywordDensity: 3,
			keywordCount: {
				count: 2,
			},
		}, true, true ), i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 3%. This is great!" );
	} );
} );
