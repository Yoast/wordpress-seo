import getParentNode from "../../../src/parse/traverse/getParentNode";
import build from "../../../src/parse/build/build";
import LanguageProcessor from "../../../src/parse/language/LanguageProcessor";
import Factory from "../../../src/helpers/factory";
import memoizedSentenceTokenizer from "../../../src/languageProcessing/helpers/sentence/memoizedSentenceTokenizer";
import Paper from "../../../src/values/Paper";

let languageProcessor, paper;

beforeEach( () => {
	const researcher = Factory.buildMockResearcher( {}, true, false, false,
		{ memoizedTokenizer: memoizedSentenceTokenizer } );
	languageProcessor = new LanguageProcessor( researcher );
	paper = new Paper( "" );
} );

describe( "A test for getParentNode", () => {
	it( "should correctly fetch the parent node for regular paragraphs", function() {
		paper._text = "<div><p class='yoast'>Hello, world!</p><p class='yoast'>Hello, Yoast!</p></div>";
		const tree = build( paper, languageProcessor );
		const paragraphs = tree.findAll( treeNode => treeNode.name === "p" );
		const parentDiv = tree.findAll( treeNode => treeNode.name === "div" )[ 0 ];

		paragraphs.forEach( paragraph => {
			const parentNode = getParentNode( tree, paragraph );
			expect( parentNode ).toEqual( parentDiv );
		} );
	} );

	it( "should correctly fetch the parent node for implicit paragraphs", function() {
		paper._text = "<div>Hello, world!<br/><br/>Hello, Yoast!</div>";
		const tree = build( paper, languageProcessor );
		const paragraphs = tree.findAll( treeNode => treeNode.name === "p" );
		const parentDiv = tree.findAll( treeNode => treeNode.name === "div" )[ 0 ];

		paragraphs.forEach( paragraph => {
			const parentNode = getParentNode( tree, paragraph );
			expect( parentNode ).toEqual( parentDiv );
		} );
	} );

	it( "should return itself if the node has no parent", function() {
		paper._text = "<p class='yoast'>Hello, world!</p><p class='yoast'>Hello, Yoast!</p>";
		const tree = build( paper, languageProcessor );
		const paragraphs = tree.findAll( treeNode => treeNode.name === "p" );

		paragraphs.forEach( paragraph => {
			const parentNode = getParentNode( tree, paragraph );
			expect( parentNode ).toEqual( paragraph );
		} );
	} );
} );
