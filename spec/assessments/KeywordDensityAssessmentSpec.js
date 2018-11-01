/* global describe it expect */
import KeywordDensityAssessment from "../../src/assessments/seo/KeywordDensityAssessment";
import Researcher from "../../src/researcher";
import Paper from "../../src/values/Paper.js";
import Mark from "../../src/values/Mark.js";
import factory from "../specHelpers/factory.js";
import morphologyData from "../../premium-configuration/data/morphologyData.json";

const i18n = factory.buildJed();

const nonkeyword = "nonkeyword, ";
const keyword = "keyword, ";

describe( "Tests for the keywordDensity assessment for languages without morphology, for regular analysis", function() {
	beforeEach( () => {
		process.env.YOAST_RECALIBRATION = "disabled";
	} );

	it( "runs the keywordDensity on the paper without keyword", function() {
		const paper = new Paper( nonkeyword.repeat( 1000 ), { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 4 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 0%. This is too low; the keyphrase was found 0 times. <a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!" );
	} );

	it( "runs the keywordDensity on the paper with a very low keyphrase density (0.1%)", function() {
		const paper = new Paper( nonkeyword.repeat( 999 ) + keyword, { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 4 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 0.1%. This is too low; the keyphrase was found 1 time. <a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!" );
	} );

	it( "runs the keywordDensity on the paper with a good keyphrase density (0.5%)", function() {
		const paper = new Paper( nonkeyword.repeat( 995 ) + keyword.repeat( 5 ), { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 0.5%. This is great!" );
	} );

	it( "runs the keywordDensity on the paper with a good keyphrase density (2%)", function() {
		const paper = new Paper( nonkeyword.repeat( 980 ) + keyword.repeat( 20 ), { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 2%. This is great!" );
	} );

	it( "runs the keywordDensity on the paper with a slightly too high keyphrase density (3%)", function() {
		const paper = new Paper( nonkeyword.repeat( 970 ) + keyword.repeat( 30 ), { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( -10 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 3%. This is over the advised 2.5% maximum; the keyphrase was found 30 times. <a href='https://yoa.st/33w' target='_blank'>Don't overoptimize</a>!" );
	} );

	it( "runs the keywordDensity on the paper with a very high keyphrase density (10%)", function() {
		const paper = new Paper( nonkeyword.repeat( 900 ) + keyword.repeat( 100 ), { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( -50 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 10%. This is way over the advised 2.5% maximum; the keyphrase was found 100 times. <a href='https://yoa.st/33w' target='_blank'>Don't overoptimize</a>!" );
	} );
} );

describe( "Tests for the keywordDensity assessment for languages with morphology, for regular analysis", function() {
	beforeEach( () => {
		process.env.YOAST_RECALIBRATION = "disabled";
	} );
	it( "gives a GOOD result when keyword density is 3.0%", function() {
		const paper = new Paper( nonkeyword.repeat( 970 ) + keyword.repeat( 30 ), { keyword: "keyword", locale: "en_EN" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 3%. This is great!" );
	} );
} );

describe( "Tests for the keywordDensity assessment for languages without morphology, for recalibration analysis", function() {
	beforeEach( () => {
		process.env.YOAST_RECALIBRATION = "enabled";
	} );

	it( "runs the keywordDensity on the paper without keyword", function() {
		const paper = new Paper( nonkeyword.repeat( 1000 ), { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 4 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: The focus keyphrase was found 0 times. That's less than the recommended minimum of 5 times for a text of this length. <a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!" );
	} );

	it( "runs the keywordDensity on the paper with a low keyphrase density (0.1%)", function() {
		const paper = new Paper( nonkeyword.repeat( 999 ) + keyword, { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 4 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: The focus keyphrase was found 1 time. That's less than the recommended minimum of 5 times for a text of this length. <a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!" );
	} );

	it( "runs the keywordDensity on the paper with a good keyphrase density (0.5%)", function() {
		const paper = new Paper( nonkeyword.repeat( 995 ) + keyword.repeat( 5 ), { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: The focus keyphrase was found 5 times. This is great!" );
	} );

	it( "runs the keywordDensity on the paper with a good keyphrase density (2%)", function() {
		const paper = new Paper( nonkeyword.repeat( 980 ) + keyword.repeat( 20 ), { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: The focus keyphrase was found 20 times. This is great!" );
	} );

	it( "runs the keywordDensity on the paper with a slightly too high keyphrase density (3.5%)", function() {
		const paper = new Paper( nonkeyword.repeat( 965 ) + keyword.repeat( 35 ), { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( -10 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: The focus keyphrase was found 35 times. That's more than the recommended maximum of 29 times for a text of this length. <a href='https://yoa.st/33w' target='_blank'>Don't overoptimize</a>!" );
	} );

	it( "runs the keywordDensity on the paper with a very high keyphrase density (10%)", function() {
		const paper = new Paper( nonkeyword.repeat( 900 ) + keyword.repeat( 100 ), { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( -50 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: The focus keyphrase was found 100 times. That's way more than the recommended maximum of 29 times for a text of this length. <a href='https://yoa.st/33w' target='_blank'>Don't overoptimize</a>!" );
	} );


	it( "adjusts the keyphrase density based on the length of the keyword with the actual density remaining at 2% - short keyphrase", function() {
		const paper = new Paper( nonkeyword.repeat( 960 ) + "b c, ".repeat( 20 ), { keyword: "b c" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: The focus keyphrase was found 20 times. This is great!" );
	} );

	it( "adjusts the keyphrase density based on the length of the keyword with the actual density remaining at 2% - long keyphrase", function() {
		const paper = new Paper( nonkeyword.repeat( 900 ) + "b c d e f, ".repeat( 20 ), { keyword: "b c d e f" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( -50 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: The focus keyphrase was found 20 times. That's way more than the recommended maximum of 12 times for a text of this length. <a href='https://yoa.st/33w' target='_blank'>Don't overoptimize</a>!" );
	} );
} );

describe( "Tests for the keywordDensity assessment for languages with morphology, for recalibration analysis", function() {
	beforeEach( () => {
		process.env.YOAST_RECALIBRATION = "enabled";
	} );
	it( "gives a GOOD result when keyword density is between 3 and 3.5%", function() {
		const paper = new Paper( nonkeyword.repeat( 968 ) + keyword.repeat( 32 ), { keyword: "keyword", locale: "en_EN" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: The focus keyphrase was found 32 times. This is great!" );
	} );
} );

describe( "A test for marking the keyword", function() {
	beforeEach( () => {
		process.env.YOAST_RECALIBRATION = "disabled";
	} );

	it( "returns markers", function() {
		const keywordDensityAssessment = new KeywordDensityAssessment();
		const paper = new Paper( "This is a very interesting paper with a keyword and another keyword.", { keyword: "keyword" }  );
		const researcher = new Researcher( paper );
		keywordDensityAssessment.getResult( paper, researcher, i18n );
		const expected = [
			new Mark( { marked: "This is a very interesting paper with a <yoastmark class='yoast-text-mark'>keyword</yoastmark> and another <yoastmark class='yoast-text-mark'>keyword</yoastmark>.",
				original: "This is a very interesting paper with a keyword and another keyword." } ) ];
		expect( keywordDensityAssessment.getMarks() ).toEqual( expected );
	} );
} );
