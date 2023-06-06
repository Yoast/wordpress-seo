/* tinyMCE*/

import markTinyMCE from "../../../src/decorator/helpers/markTinyMCE";
import { Paper } from "yoastseo";
import { Mark } from "yoastseo/src/values";

/**
 * Mocks the Dom.
 * @returns {object} A mock of the DOM.
 */
function mockDom() {
	return {
		select: jest.fn(),
	};
}

/**
 * Mocks the TinyMCE.Editor object.
 * @param {Object} dom A mock of the dom object.
 * @returns {Object} A mock of the editor.
 */
function mockEditor( dom ) {
	return {
		dom,
		getContent: jest.fn(),
		setContent: jest.fn(),
	};
}

describe( "tests markTinyMCE", function() {
	let dom, editor;

	beforeEach( () => {
		dom = mockDom();
		editor = mockEditor( dom );
	} );

	it( "should correctly apply position based highlighting", () => {
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

	it( "should correctly mark multiple items in the same sentence", function() {
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

	// This behaviour is set as default. Feel free to change this if needed.
	it( "should return an empty string if there is no html", function() {
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

	it( "should do the right thing if a mark contains 'out of bounds' position", () => {
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
