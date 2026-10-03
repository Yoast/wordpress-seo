import getAllWordsFromTree, { getWordsFromTokens } from "../../../../src/languageProcessing/helpers/word/getAllWordsFromTree";
import buildTree from "../../../specHelpers/parse/buildTree";
import Paper from "../../../../src/values/Paper";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import Token from "../../../../src/parse/structure/Token";

describe( "a test for getting words from the tree", () => {
	let researcher;
	beforeEach( () => {
		researcher = new EnglishResearcher();
	} );
	it( "should retrieve the words from the paper, excluding the html tags and punctuations", () => {
		const paper = new Paper( "<p>A very intelligent cat loves their human. A dog is very cute.</p><h3>A subheading 3" +
			"</h3>text text text<h4>A subheading 4</h4>more text." );
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		expect( getAllWordsFromTree( paper ).length ).toEqual( 23 );
		expect( getAllWordsFromTree( paper ) ).toEqual( [ "A", "very", "intelligent", "cat", "loves", "their", "human",
			"A", "dog", "is", "very", "cute", "A", "subheading", "3", "text", "text", "text", "A", "subheading", "4", "more", "text" ] );
	} );
	it( "should get the correct words from text containing &nbsp; and word enclosed in double quotes", () => {
		const paper = new Paper( "<p>What's black, orange, sassy all over, and a crowd favorite?&nbsp;Yep, you guessed it - \"Torties\"!</p>" );
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		expect( getAllWordsFromTree( paper ).length ).toEqual( 15 );
		expect( getAllWordsFromTree( paper ) ).toEqual( [ "What's", "black", "orange", "sassy", "all", "over", "and", "a", "crowd",
			"favorite", "Yep", "you", "guessed", "it", "Torties" ] );
	} );
	it( "should not return words from the excluded elements from the tree", () => {
		const paper = new Paper( "<blockquote cite=\"https://www.huxley.net/bnw/four.html\">" +
			"<p>From their cute little paws to their mysterious ways of sneaking up on us, cats are just the best!</p></blockquote>" +
			"<p>The sentence above is a very compelling quote!</p>" );
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		expect( getAllWordsFromTree( paper ).length ).toEqual( 8 );
		expect( getAllWordsFromTree( paper ) ).toEqual( [ "The", "sentence", "above", "is", "a", "very", "compelling", "quote" ] );
	} );
	it( "should return empty array if text is empty", () => {
		const paper = new Paper( "" );
		researcher.setPaper( paper );
		buildTree( paper, researcher );
		expect( getAllWordsFromTree( paper ).length ).toEqual( 0 );
		expect( getAllWordsFromTree( paper ) ).toEqual( [] );
	} );

	it( "should split tokens on hyphens if requested", () => {
		const tokens = [ new Token( "this" ), new Token( "is" ), new Token( "a" ),
			new Token( "test" ), new Token( "-" ), new Token( "text" ) ];
		expect( getWordsFromTokens( tokens, true ) ).toEqual( [ "this", "is", "a", "test", "text" ] );
		expect( getWordsFromTokens( tokens, false ) ).toEqual( [ "this", "is", "a", "test-text" ] );
	} );
	it( "should correctly deal with hyphens in first and last position", () => {
		const tokens = [ new Token( "-" ), new Token( "this" ), new Token( "is" ), new Token( "a" ),
			new Token( "test" ), new Token( "-" ), new Token( "text" ), new Token( "-" ) ];
		expect( getWordsFromTokens( tokens, true ) ).toEqual( [ "this", "is", "a", "test", "text" ] );
		expect( getWordsFromTokens( tokens, false ) ).toEqual( [ "this", "is", "a", "test-text" ] );
	} );
} );
