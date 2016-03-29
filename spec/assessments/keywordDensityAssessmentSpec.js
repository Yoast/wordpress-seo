var keywordDensityAssessment = require( "../../js/assessments/keywordDensity.js" );
var Paper = require( "../../js/values/Paper.js" );

var factory = require( "../helpers/factory.js" );
var i18n = factory.buildJed();

describe( "An assessment for the keywordDensity", function(){
	it( "runs the keywordDensity on the paper", function(){

		var paper = new Paper( "string without the key", {keyword: "keyword"} );
		var result = keywordDensityAssessment.getResult( paper, Factory.buildMockResearcher( 0.0 ), i18n );
		expect(result.getScore()).toBe( 4 );
		expect(result.getText()).toBe( "The keyword density is 0.0%, which is a bit low; the focus keyword was found 0 times.");

		paper = new Paper( "string with the keyword", {keyword: "keyword"} );
		result = keywordDensityAssessment.getResult( paper, Factory.buildMockResearcher( 10.0 ), i18n );
		expect(result.getScore()).toBe( -50 );
		expect(result.getText()).toBe( "The keyword density is 10.0%, which is way over the advised 2.5% maximum; the focus keyword was found 1 times.");

		paper = new Paper( "string with the keyword", {keyword: "keyword"} );
		result = keywordDensityAssessment.getResult( paper, Factory.buildMockResearcher( 2.0 ), i18n );
		expect(result.getScore()).toBe( 9 );
		expect(result.getText()).toBe( "The keyword density is 2.0%, which is great; the focus keyword was found 1 times.");

		paper = new Paper( "string with the keyword  and keyword ", {keyword: "keyword"} );
		result = keywordDensityAssessment.getResult( paper, Factory.buildMockResearcher( 3.0 ), i18n );
		expect(result.getScore()).toBe( -10 );
		expect(result.getText()).toBe( "The keyword density is 3.0%, which is over the advised 2.5% maximum; the focus keyword was found 2 times.");

	} );
} );
