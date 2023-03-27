/* tinyMCE*/

import markTinyMCE from "../../../src/decorator/helpers/markTinyMCE";
import { Paper } from "yoastseo";
import { Mark } from "yoastseo/src/values";

function mockDom() {
	return {
		select: jest.fn(),
	};
}

function mockEditor( dom ) {
	return {
		dom,
		getContent: jest.fn(),
		setContent: jest.fn(),
	};
}

describe( "tests markTinyMCE", function() {
	it( "should correctly apply position based highlighting", () => {
		const dom = mockDom();
		const editor = mockEditor( dom );

		const html = "<h1>Hallo!</h1>";

		editor.getContent.mockReturnValue( html );

		const paper = new Paper( html );
		const marks = [
			new Mark( {
				position: {
					startOffset: 4,
					endOffset: 10,
				},
			} ),
		];

		markTinyMCE( editor, paper, marks );

		expect( editor.setContent ).toBeCalledWith( "<h1><yoastmark class='yoast-text-mark'>Hallo!</yoastmark></h1>" );
	} );

	it( "should correctly apply search based highlighting.", function() {
		const dom = mockDom();
		const editor = mockEditor( dom );

		const html = "<h1>Hallo!</h1>";

		editor.getContent.mockReturnValue( html );

		const paper = new Paper( html );
		const marks = [
			new Mark( {
				original: "Hallo!",
				marked: "<yoastmark class='yoast-text-mark'>Hallo!</yoastmark>",
			} ),
		];

		markTinyMCE( editor, paper, marks );

		expect( editor.setContent ).toBeCalledWith( "<h1><yoastmark class=\"yoast-text-mark\">Hallo!</yoastmark></h1>" );
	} );

	it( "correctly applies marks on a RTL text (hebrew)", ()=> {
		const dom = mockDom();
		const editor = mockEditor( dom );

		const html = "<span>התשובה לחיים היקום והכל.</span>";

		editor.getContent.mockReturnValue( html );

		const paper = new Paper( html );
		const marks = [
			new Mark( {
				position: {
					startOffset: 19,
					endOffset: 24,
				},
			} ),
		];

		markTinyMCE( editor, paper, marks );
		expect( editor.setContent ).toBeCalledWith( "<span>התשובה לחיים <yoastmark class='yoast-text-mark'>היקום</yoastmark> והכל.</span>" );
	} );

	xit( "should correctly highlight an arabic text with position based highlighting.", function() {
		// TODO: maybe implement this. (With aidas help)
		expect( "A" ).toEqual( "B" );
	} );

	it( "should correctly mark multiple items in the same sentence", function() {
		const dom = mockDom();
		const editor = mockEditor( dom );

		const html = "<p>The answer to <i>life</i> the <b>universe</b> and <strong>everything</strong>.</p>";

		editor.getContent.mockReturnValue( html );

		const paper = new Paper( html );
		const marks = [
			new Mark( {
				position: {
					startOffset: 20,
					endOffset: 24,
				},
			} ),
			new Mark( {
				position: {
					startOffset: 33,
					endOffset: 48,
				},
			} ),
			new Mark( {
				position: {
					startOffset: 53,
					endOffset: 81,
				},
			} ),
		];

		markTinyMCE( editor, paper, marks );

		expect( editor.setContent ).toBeCalledWith( "<p>The answer to <i><yoastmark class='yoast-text-mark'>life</yoastmark></i> the " +
			"<yoastmark class='yoast-text-mark'><b>universe</b></yoastmark> and " +
			"<yoastmark class='yoast-text-mark'><strong>everything</strong>.</yoastmark></p>" );
	} );

	// TODO: maybe do the following. If I can work out how this works.
	xit( "correctly applies marks on a text with multi-position-characters.", () => {

	} );

	// This behaviour is set as default. Feel free to change this if needed.
	it( "should return an empty string if there is no html", function() {
		const dom = mockDom();
		const editor = mockEditor( dom );

		const html = "";

		editor.getContent.mockReturnValue( html );

		const paper = new Paper( html );
		const marks = [
			new Mark( {
				position: {
					startOffset: 4,
					endOffset: 10,
				},
			} ),
		];

		markTinyMCE( editor, paper, marks );

		expect( editor.setContent ).toBeCalledWith( "" );
	} );

	it( "should exit early if Marks is empty", function() {
		const dom = mockDom();
		const editor = mockEditor( dom );

		const html = "<h1>Hallo!</h1>";

		editor.getContent.mockReturnValue( html );

		const paper = new Paper( html );
		const marks = [];

		markTinyMCE( editor, paper, marks );

		expect( editor.getContent ).not.toHaveBeenCalled();
		expect( editor.setContent ).not.toHaveBeenCalled();
	} );

	it( "should do the right thing if a mark contains 'out of bounds' position", () => {
		const dom = mockDom();
		const editor = mockEditor( dom );

		const html = "<h1>Hallo!</h1>";

		editor.getContent.mockReturnValue( html );

		const paper = new Paper( html );
		const marks = [
			new Mark( {
				position: {
					startOffset: 100,
					endOffset: 120,
				},
			} ),
		];

		markTinyMCE( editor, paper, marks );

		expect( editor.setContent ).toBeCalledWith( "<h1>Hallo!</h1>" );
	} );

	it( "should correctly apply marks if the marks are presented in the wrong order", function() {
		const dom = mockDom();
		const editor = mockEditor( dom );

		const html = "<p>The answer to <i>life</i> the <b>universe</b> and <strong>everything</strong>.</p>";

		editor.getContent.mockReturnValue( html );

		const paper = new Paper( html );
		const marks = [
			new Mark( {
				position: {
					startOffset: 53,
					endOffset: 81,
				},
			} ),
			new Mark( {
				position: {
					startOffset: 33,
					endOffset: 48,
				},
			} ),

			new Mark( {
				position: {
					startOffset: 20,
					endOffset: 24,
				},
			} ),
		];

		markTinyMCE( editor, paper, marks );

		expect( editor.setContent ).toBeCalledWith( "<p>The answer to <i><yoastmark class='yoast-text-mark'>life</yoastmark></i> the " +
			"<yoastmark class='yoast-text-mark'><b>universe</b></yoastmark> and " +
			"<yoastmark class='yoast-text-mark'><strong>everything</strong>.</yoastmark></p>" );
	} );

} );

// TODO: decide whether to test markTinyMCEPositionBased in isolation.
