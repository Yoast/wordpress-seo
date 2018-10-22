import PreviouslyUsedKeywords from "../../src/bundledPlugins/previouslyUsedKeywords.js";

var usedKeywords = { keyword: [ 1 ], test: [ 2, 3, 4 ] };
import Paper from "../../src/values/Paper.js";
import Factory from "../specHelpers/factory.js";
var i18n = Factory.buildJed();

var app = {};

var searchUrl =  "http://search?{keyword}";
var postUrl = "http://post?{id}";

var args = {
	usedKeywords: usedKeywords,
	searchUrl: searchUrl,
	postUrl: postUrl,
};

describe( "checks for keyword doubles", function() {
	it( "returns array with keyword", function() {
		var paper = new Paper( "text", { keyword: "keyword" } );

		var plugin = new PreviouslyUsedKeywords( app, args, i18n );
		expect( plugin.scoreAssessment( { id: 1, count: 1 }, paper, i18n ).score ).toBe( 6 );
		expect( plugin.scoreAssessment( { id: 1, count: 1 }, paper, i18n ).text ).toBe( "<a href='https://yoa.st/33x' target='_blank'>Previously used keyphrase</a>: " +
			"You've used this keyphrase <a href='http://post?1' target='_blank'>once before</a>. " +
			"<a href='https://yoa.st/33y' target='_blank'>Do not use your keyphrase more than once</a>." );

		expect( plugin.scoreAssessment( { id: 1, count: 2 }, paper, i18n ).score ).toBe( 1 );
		expect( plugin.scoreAssessment( { id: 1, count: 2 }, paper, i18n ).text ).toBe( "<a href='https://yoa.st/33x' target='_blank'>Previously used keyphrase</a>: " +
			"You've used this keyphrase <a href='http://search?keyword' target='_blank'>2 times before</a>. " +
			"<a href='https://yoa.st/33y' target='_blank'>Do not use your keyphrase more than once</a>." );

		expect( plugin.scoreAssessment( { id: 0, count: 0 }, paper, i18n ).score ).toBe( 9 );
		expect( plugin.scoreAssessment( { id: 0, count: 0 }, paper, i18n ).text ).toBe( "<a href='https://yoa.st/33x' target='_blank'>Previously used keyphrase</a>: You've not used this keyphrase before, very good." );
	} );

	it( "escapes the keyword's special characters in the url", function() {
		var paper = new Paper( "text", { keyword: "keyword/bla" } );
		var plugin = new PreviouslyUsedKeywords( app, args, i18n );
		expect( plugin.scoreAssessment( { id: 1, count: 2 }, paper, i18n ).text ).toBe( "<a href='https://yoa.st/33x' target='_blank'>Previously used keyphrase</a>: " +
			"You've used this keyphrase <a href='http://search?keyword%2Fbla' target='_blank'>2 times before</a>. " +
			"<a href='https://yoa.st/33y' target='_blank'>Do not use your keyphrase more than once</a>." );
	} );
} );

describe( "checks for keyword doubles", function() {
	it( "returns array with keyword", function() {
		var plugin = new PreviouslyUsedKeywords( app, undefined, i18n ); // eslint-disable-line no-undefined
		expect( plugin.searchUrl ).toBe( "" );
	} );
} );

describe( "replaces keyword usage", function() {
	it( "adds keywords", function() {
		usedKeywords = undefined;  // eslint-disable-line no-undefined

		args = {
			usedKeywords: usedKeywords,
			searchUrl: searchUrl,
			postUrl: postUrl,
		};

		const plugin = new PreviouslyUsedKeywords( app, args, i18n );
		expect( plugin.usedKeywords ).not.toBeDefined();
		plugin.updateKeywordUsage(  { keyword: [ 1 ], test: [ 2, 3, 4 ] } );
		expect( plugin.usedKeywords.keyword ).toContain( 1 );
	} );
} );
