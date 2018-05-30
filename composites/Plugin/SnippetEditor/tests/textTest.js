// External dependencies.
import { EditorState, ContentState, SelectionState } from "draft-js";

// Internal dependencies.
import {
	hasWhitespaceAt,
	getCaretOffset,
	getAnchorBlock,
	insertText,
	removeSelection,
	moveCaret,
} from "../text";

describe( "SnippetEditor text utilities", () => {
	describe( "hasWhitespaceAt", () => {
		const whitespaceText = "a \nb";

		it( "identifies the letter a as non-whitespace", () => {
			const actual = hasWhitespaceAt( whitespaceText, 0 );
			const expected = false;

			expect( actual ).toBe( expected );
		} );

		it( "identifies a space as whitespace", () => {
			const actual = hasWhitespaceAt( whitespaceText, 1 );
			const expected = true;

			expect( actual ).toBe( expected );
		} );

		it( "identifies a newline as whitespace", () => {
			const actual = hasWhitespaceAt( whitespaceText, 2 );
			const expected = true;

			expect( actual ).toBe( expected );
		} );

		it( "identifies a negative index as whitespace", () => {
			const actual = hasWhitespaceAt( whitespaceText, -1 );
			const expected = true;

			expect( actual ).toBe( expected );
		} );

		it( "identifies an out of bounds index as whitespace", () => {
			const actual = hasWhitespaceAt( whitespaceText, whitespaceText.length );
			const expected = true;

			expect( actual ).toBe( expected );
		} );
	} );

	describe( "getCaretOffset", () => {
		it( "returns the start offset when there is no collapse", () => {
			const selection = new SelectionState( {
				anchorKey: "foo",
				anchorOffset: 1,
				focusKey: "bar",
				focusOffset: 1,
				isBackward: false,
				hasFocus: false,
			} );
			const actual = getCaretOffset( selection );
			const expected = selection.getStartOffset();

			expect( actual ).toBe( expected );
		} );

		it( "returns the start offset when there is a collapse", () => {
			const selection = new SelectionState( {
				anchorKey: "foo",
				anchorOffset: 2,
				focusKey: "bar",
				focusOffset: 10,
				isBackward: false,
				hasFocus: false,
			} );
			const actual = getCaretOffset( selection );
			const expected = selection.getStartOffset();

			expect( actual ).toBe( expected );
		} );

		it( "returns the end offset when there is a collapse and it is backwards", () => {
			const selection = new SelectionState( {
				anchorKey: "foo",
				anchorOffset: 10,
				focusKey: "bar",
				focusOffset: 2,
				isBackward: true,
				hasFocus: false,
			} );
			const actual = getCaretOffset( selection );
			const expected = selection.getEndOffset();

			expect( actual ).toBe( expected );
		} );
	} );

	describe( "getAnchorBlock", () => {
		it( "to contain the same text as we input", () => {
			const expected = "testing anchor block";
			const content = ContentState.createFromText( expected );
			const editor = EditorState.createWithContent( content );
			const block = getAnchorBlock( editor.getCurrentContent(), editor.getSelection() );
			const actual = block.getText();

			expect( actual ).toBe( expected );
		} );
	} );

	describe( "insertText", () => {} );

	describe( "replaceText", () => {} );

	describe( "removeSelection", () => {} );

	describe( "moveCaret", () => {} );
} );
