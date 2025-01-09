import PreviouslyUsedKeywords from "../../src/bundledPlugins/previouslyUsedKeywords.js";

let usedKeywords = { keyword: [ 2, 3, 4 ] };
import Paper from "../../src/values/Paper.js";
import MissingArgumentError from "../../src/errors/missingArgument";

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
		expect( plugin.scoreAssessment( { id: 1, count: 2, postTypeToDisplay: "Paper" }, paper ).text ).toBe( "<a href='https://yoa.st/33x' " +
			"target='_blank'>Previously used keyphrase</a>: You've used this keyphrase <a href='http://search?keyword&post_type=Paper' " +
			"target='_blank'>multiple times before</a>. <a href='https://yoa.st/33y' target='_blank'>" +
			"Do not use your keyphrase more than once</a>." );

		expect( plugin.scoreAssessment( { id: 0, count: 0 }, paper ).score ).toBe( 9 );
		expect( plugin.scoreAssessment( { id: 0, count: 0 }, paper ).text ).toBe( "<a href='https://yoa.st/33x' " +
			"target='_blank'>Previously used keyphrase</a>: You've not used this keyphrase before, very good." );
	} );

	it( "escapes the keyword's special characters in the url", function() {
		const paper = new Paper( "text", { keyword: "keyword/bla" } );
		const plugin = new PreviouslyUsedKeywords( app, args );
		expect( plugin.scoreAssessment( { id: 1, count: 2, postTypeToDisplay: "post" }, paper ).text ).toBe( "<a href='https://yoa.st/33x' " +
			"target='_blank'>Previously used keyphrase</a>: You've used this keyphrase " +
			"<a href='http://search?keyword%2Fbla&post_type=post' target='_blank'>multiple times before</a>. " +
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
		plugin.updateKeywordUsage(  { keyword: [ 1 ] } );
		expect( plugin.usedKeywords.keyword ).toContain( 1 );
	} );
} );

describe( "previously used keyphrase when postTypeToDisplay is defined and count is 2 or more", () => {
	args = {
		usedKeywords: { keyword: [ 2, 3, 4 ] },
		searchUrl: searchUrl,
		postUrl: postUrl,
		usedKeywordsPostTypes: { keyword: [ "Post", "Page", "Product" ] },
	};
	const paper = new Paper( "This is a text with a keyword.", { keyword: "keyword" } );
	const plugin = new PreviouslyUsedKeywords( app, args );

	const result = plugin.assess( paper );
	it( "correctly counts the times the keyword is used before when postTypeToDisplay is defined", () => {
		expect( result.score ).toEqual( 1 );
	} );

	it( "correctly creates feedback when postTypeToDisplay is defined", () => {
		expect( result.text ).toEqual( "<a href='https://yoa.st/33x' target='_blank'>Previously used keyphrase</a>: " +
			"You've used this keyphrase <a href='http://search?keyword&post_type=Post' target='_blank'>multiple times before</a>. " +
			"<a href='https://yoa.st/33y' target='_blank'>Do not use your keyphrase more than once</a>." );
	} );
} );


describe( "previously used keyphrase when postTypeToDisplay is defined and count is 1", () => {
	args = {
		usedKeywords: { keyword: [ 42 ] },
		searchUrl: searchUrl,
		postUrl: postUrl,
		usedKeywordsPostTypes: { keyword: [ "Product" ] },
	};
	const paper = new Paper( "This is a text with a keyword.", { keyword: "keyword" } );
	const plugin = new PreviouslyUsedKeywords( app, args );

	const result = plugin.assess( paper );
	it( "correctly counts the times the keyword is used before when postTypeToDisplay is defined", () => {
		expect( result.score ).toEqual( 6 );
	} );

	it( "correctly creates feedback when postTypeToDisplay is defined", () => {
		expect( result.text ).toEqual( "<a href='https://yoa.st/33x' target='_blank'>Previously used keyphrase</a>: " +
			"You've used this keyphrase <a href='http://post?42' target='_blank'>once before</a>. " +
			"<a href='https://yoa.st/33y' target='_blank'>Do not use your keyphrase more than once</a>." );
	} );
} );

describe( "previously used keyphrase when postTypeToDisplay is defined and count is 0", () => {
	args = {
		usedKeywords: { keyword: [ ] },
		searchUrl: searchUrl,
		postUrl: postUrl,
		usedKeywordsPostTypes: { keyword: [ ] },
	};
	const paper = new Paper( "This is a text with a keyword.", { keyword: "keyword" } );
	const plugin = new PreviouslyUsedKeywords( app, args );

	const result = plugin.assess( paper );
	it( "correctly counts the times the keyword is used before when postTypeToDisplay is defined", () => {
		expect( result.score ).toEqual( 9 );
	} );

	it( "correctly creates feedback when postTypeToDisplay is defined", () => {
		expect( result.text ).toEqual( "<a href='https://yoa.st/33x' target='_blank'>" +
			"Previously used keyphrase</a>: You've not used this keyphrase before, very good." );
	} );
} );

describe( "Test previouslyUsedKeywords when app is undefined", () => {
	it( "should throw an error if app is undefined", () => {
		expect( () => {
			// eslint-disable-next-line no-undefined
			new PreviouslyUsedKeywords( undefined, {} );
		} ).toThrow( MissingArgumentError );
	} );
} );

describe( "Test behaviour of previouslyUsedKeywords when args is undefined", () => {
	it( "should use the default value for args", () => {
		// eslint-disable-next-line no-undefined
		const plugin = new PreviouslyUsedKeywords( args, undefined );
		expect( plugin.usedKeywords ).toEqual( {} );
		expect( plugin.usedKeywordsPostTypes ).toEqual( {} );
		expect( plugin.searchUrl ).toEqual( "" );
		expect( plugin.postUrl ).toEqual( "" );
	} );
} );
