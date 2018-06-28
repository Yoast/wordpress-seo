/* global describe it expect */
const TopicDensityAssessment = require( "../../js/assessments/seo/topicDensityAssessment.js" );
const Paper = require( "../../js/values/Paper.js" );
const Mark = require( "../../src/values/Mark.js" );
const factory = require( "../helpers/factory.js" );
const i18n = factory.buildJed();

describe( "An assessment for the topicDensity", function() {
	it( "runs the topicDensity on the paper with only keyword specified", function() {
		let paper = new Paper( "string without the key", { keyword: "keyword", synonyms: "synonym" } );
		let result = new TopicDensityAssessment().getResult( paper, factory.buildMockResearcher( {
			getTopicDensity: 0,
			topicCount: {
				count: 0,
			},
		}, true ), i18n );
		expect( result.getScore() ).toBe( 4 );
		expect( result.getText() ).toBe( "The topic density is 0%, which is too low; the focus keyword and its synonyms were found 0 times." );

		paper = new Paper( "string with the keyword", { keyword: "keyword", synonyms: "synonym" } );
		result = new TopicDensityAssessment().getResult( paper, factory.buildMockResearcher( {
			getTopicDensity: 10,
			topicCount: {
				count: 50,
			},
		}, true ), i18n );
		expect( result.getScore() ).toBe( -50 );
		expect( result.getText() ).toBe( "The topic density is 10%, which is way over the advised 3% maximum; the focus keyword and its synonyms were found 50 times." );

		paper = new Paper( "string with the keyword", { keyword: "keyword", synonyms: "synonym" } );
		result = new TopicDensityAssessment().getResult( paper, factory.buildMockResearcher( {
			getTopicDensity: 2,
			topicCount: {
				count: 1,
			},
		}, true ), i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "The topic density is 2%, which is great; the focus keyword and its synonyms were found 1 time." );

		paper = new Paper( "string with the keyword and keyword ", { keyword: "keyword", synonyms: "synonym" } );
		result = new TopicDensityAssessment().getResult( paper, factory.buildMockResearcher( {
			getTopicDensity: 3.5,
			topicCount: {
				count: 2,
			},
		}, true ), i18n );
		expect( result.getScore() ).toBe( -10 );
		expect( result.getText() ).toBe( "The topic density is 3.5%, which is over the advised 3% maximum; the focus keyword and its synonyms were found 2 times." );

		paper = new Paper( "string with the keyword and keyword ", { keyword: "keyword", synonyms: "synonym" } );
		result = new TopicDensityAssessment().getResult( paper, factory.buildMockResearcher( {
			getTopicDensity: 0.5,
			topicCount: {
				count: 2,
			},
		}, true ), i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "The topic density is 0.5%, which is great; the focus keyword and its synonyms were found 2 times." );
	} );
} );

describe( "A test for marking the keyword and its synonyms", function() {
	it( "returns markers", function() {
		const paper = new Paper( "This is a very interesting paper with a keyword and other keywords.", { keyword: "keyword", synonyms: "other keywords" }  );
		const expected = [
			new Mark( {
				original: "This is a very interesting paper with a keyword and other keywords.",
				marked: "This is a very interesting paper with a<yoastmark class='yoast-text-mark'> keyword</yoastmark> and<yoastmark class='yoast-text-mark'> other keywords</yoastmark>.",
			} ),
		];
		expect( new TopicDensityAssessment().getMarks( paper ) ).toEqual( expected );
	} );

	it( "returns markers when there is overlap", function() {
		const paper = new Paper( "This is a very interesting paper with a key word and another key.", { keyword: "key", synonyms: "key word" } );
		const expected = [
			new Mark( {
				original: "This is a very interesting paper with a key word and another key.",
				marked: "This is a very interesting paper with a<yoastmark class='yoast-text-mark'> key word</yoastmark> and another<yoastmark class='yoast-text-mark'> key</yoastmark>.",
			} ),
		];
		expect( new TopicDensityAssessment().getMarks( paper ) ).toEqual( expected );
	} );

	it( "returns no markers", function() {
		const paper = new Paper( "This is a very interesting paper with a keyword and other keywords.", { keyword: "seaside", synonyms: "beach" } );
		const expected = [];
		expect( new TopicDensityAssessment().getMarks( paper ) ).toEqual( expected );
	} );
} );
