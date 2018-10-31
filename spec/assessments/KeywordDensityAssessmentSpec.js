/* global describe it expect */
import KeywordDensityAssessment from "../../src/assessments/seo/KeywordDensityAssessment";
import Researcher from "../../src/researcher";
import Paper from "../../src/values/Paper.js";
import Mark from "../../src/values/Mark.js";
import factory from "../specHelpers/factory.js";
import morphologyData from "../../premium-configuration/data/morphologyData.json";

const i18n = factory.buildJed();

const a = "a ";
const shortText = a.repeat( 9 );
const mediumText = a.repeat( 48 );
const longText = a.repeat( 99 );
const superLongText = a.repeat( 999 );

describe( "Tests for the keywordDensity assessment for languages without morphology, for regular analysis", function() {
	beforeEach( () => {
		process.env.YOAST_RECALIBRATION = "disabled";
	} );

	it( "runs the keywordDensity on the paper without keyword", function() {
		const paper = new Paper( "string without the key", { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 4 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 0%. This is too low; the keyphrase was found 0 times. <a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!" );
	} );

	it( "runs the keywordDensity on the paper with a very low keyphrase density (0.1%)", function() {
		const paper = new Paper( superLongText + "keyword", { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 4 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 0.1%. This is too low; the keyphrase was found 1 time. <a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!" );
	} );

	it( "runs the keywordDensity on the paper with a good keyphrase density (0.5%)", function() {
		const paper = new Paper( longText + longText + "a keyword", { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 0.5%. This is great!" );
	} );

	it( "runs the keywordDensity on the paper with a good keyphrase density (2%)", function() {
		const paper = new Paper( mediumText + "a keyword", { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 2%. This is great!" );
	} );

	it( "runs the keywordDensity on the paper with a slightly too high keyphrase density (3%)", function() {
		const paper = new Paper( mediumText + mediumText + "a keyword. Keyword. Keyword. ", { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( -10 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 3%. This is over the advised 2.5% maximum; the keyphrase was found 3 times. <a href='https://yoa.st/33w' target='_blank'>Don't overoptimize</a>!" );
	} );

	it( "runs the keywordDensity on the paper with a very high keyphrase density (10%)", function() {
		const paper = new Paper( shortText + "keyword", { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( -50 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: 10%. This is way over the advised 2.5% maximum; the keyphrase was found 1 time. <a href='https://yoa.st/33w' target='_blank'>Don't overoptimize</a>!" );
	} );
} );

describe( "Tests for the keywordDensity assessment for languages with morphology, for regular analysis", function() {
	beforeEach( () => {
		process.env.YOAST_RECALIBRATION = "disabled";
	} );
	it( "gives a GOOD result when keyword density is 3.0%", function() {
		const paper = new Paper( mediumText + mediumText + "a keyword. Keyword. Keyword. ", { keyword: "keyword", locale: "en_EN" } );
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
		const paper = new Paper( "string without the key", { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 4 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: The focus keyphrase was found 0 times. That's less than the recommended minimum of 2 times for a text of this length. <a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!" );
	} );

	it( "runs the keywordDensity on the paper with a low keyphrase density (0.1%)", function() {
		const paper = new Paper( superLongText + "keyword", { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 4 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: The focus keyphrase was found 1 time. That's less than the recommended minimum of 5 times for a text of this length. <a href='https://yoa.st/33w' target='_blank'>Focus on your keyphrase</a>!" );
	} );

	it( "runs the keywordDensity on the paper with a good keyphrase density (0.5%)", function() {
		const paper = new Paper( longText + longText + "a keyword", { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: The focus keyphrase was found 1 time. This is great!" );
	} );

	it( "runs the keywordDensity on the paper with a good keyphrase density (2%)", function() {
		const paper = new Paper( mediumText + "a keyword", { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: The focus keyphrase was found 1 time. This is great!" );
	} );

	it( "runs the keywordDensity on the paper with a slightly too high keyphrase density (3.8%)", function() {
		const paper = new Paper( longText + longText + "a keyword. Keyword. Keyword. Keyword. Keyword. Keyword. Keyword. Keyword.", { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( -10 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: The focus keyphrase was found 8 times. That's more than the recommended maximum of 6 times for a text of this length. <a href='https://yoa.st/33w' target='_blank'>Don't overoptimize</a>!" );
	} );

	it( "runs the keywordDensity on the paper with a very high keyphrase density", function() {
		const paper = new Paper( shortText + "keyword", { keyword: "keyword" } );
		const researcher = new Researcher( paper );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( -50 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: The focus keyphrase was found 1 time. That's way more than the recommended maximum of 2 times for a text of this length. <a href='https://yoa.st/33w' target='_blank'>Don't overoptimize</a>!" );
	} );
} );

describe( "Tests for the keywordDensity assessment for languages with morphology, for recalibration analysis", function() {
	beforeEach( () => {
		process.env.YOAST_RECALIBRATION = "enabled";
	} );
	it( "gives a GOOD result when keyword density is between 3 and 3.5%", function() {
		const paper = new Paper( mediumText + mediumText + mediumText + mediumText + "a keyword. Keywords. Keywording. Keyworded. Totally keywordly. Keyword. ", { keyword: "keyword", locale: "en_EN" } );
		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		const result = new KeywordDensityAssessment().getResult( paper, researcher, i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/33v' target='_blank'>Keyphrase density</a>: The focus keyphrase was found 6 times. This is great!" );
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
