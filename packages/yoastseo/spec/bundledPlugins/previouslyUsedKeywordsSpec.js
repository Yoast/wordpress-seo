import PreviouslyUsedKeywords from "../../src/bundledPlugins/previouslyUsedKeywords.js";

let usedKeywords = { keyword: [ 1 ], test: [ 2, 3, 4 ] };
import Paper from "../../src/values/Paper.js";

const app = {};

const searchUrl = "http://search?{keyword}";
const postUrl = "http://post?{id}";

let args = {
	usedKeywords: usedKeywords,
	searchUrl: searchUrl,
	postUrl: postUrl,
};

describe( "checks for keyword doubles", function() {
	it( "returns array with keyword", function() {
		const paper = new Paper( "text", { keyword: "keyword" } );

		const plugin = new PreviouslyUsedKeywords( app, args );
		expect( plugin.scoreAssessment( { id: 1, count: 1 }, paper ).score ).toBe( 6 );
		expect( plugin.scoreAssessment( { id: 1, count: 1 }, paper ).text ).toBe( "<a href='https://yoa.st/33x' target='_blank'>" +
			"Previously used keyphrase</a>: You've used this keyphrase <a href='http://post?1' target='_blank'>once before</a>. " +
			"<a href='https://yoa.st/33y' target='_blank'>Do not use your keyphrase more than once</a>." );

		expect( plugin.scoreAssessment( { id: 1, count: 2 }, paper ).score ).toBe( 1 );
		expect( plugin.scoreAssessment( { id: 1, count: 2 }, paper ).text ).toBe("<a href='https://yoa.st/33x' " +
			"target='_blank'>Previously used keyphrase</a>: You've used this keyphrase <a href='http://search?keyword&post_type=undefined' " +
			"target='_blank'> multiple times before</a>. <a href='https://yoa.st/33y' target='_blank'>" +
			"Do not use your keyphrase more than once</a>." );

		expect( plugin.scoreAssessment( { id: 0, count: 0 }, paper ).score ).toBe( 9 );
		expect( plugin.scoreAssessment( { id: 0, count: 0 }, paper ).text ).toBe( "<a href='https://yoa.st/33x' " +
			"target='_blank'>Previously used keyphrase</a>: You've not used this keyphrase before, very good." );
	} );

	it( "escapes the keyword's special characters in the url", function() {
		const paper = new Paper( "text", { keyword: "keyword/bla" } );
		const plugin = new PreviouslyUsedKeywords( app, args );
		expect( plugin.scoreAssessment( { id: 1, count: 2 }, paper ).text ).toBe( "<a href='https://yoa.st/33x' " +
			"target='_blank'>Previously used keyphrase</a>: You've used this keyphrase " +
			"<a href='http://search?keyword%2Fbla&post_type=undefined' target='_blank'> multiple times before</a>. " +
			"<a href='https://yoa.st/33y' target='_blank'>Do not use your keyphrase more than once</a>." );
	} );
} );

describe( "checks for keyword doubles2", function() {
	it( "returns array with keyword2", function() {
		const plugin = new PreviouslyUsedKeywords( app, undefined ); // eslint-disable-line no-undefined
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

		const plugin = new PreviouslyUsedKeywords( app, args );
		expect( plugin.usedKeywords ).not.toBeDefined();
		plugin.updateKeywordUsage(  { keyword: [ 1 ], test: [ 2, 3, 4 ] } );
		expect( plugin.usedKeywords.keyword ).toContain( 1 );
	} );
} );
