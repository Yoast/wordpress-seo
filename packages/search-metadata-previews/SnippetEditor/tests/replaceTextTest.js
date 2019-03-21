// External dependencies.
import { EditorState, ContentState, SelectionState } from "draft-js";

// Internal dependencies.
import {
	getTrigger,
	hasWhitespaceAt,
	getCaretOffset,
	getAnchorBlock,
	insertText,
	removeSelectedText,
	moveCaret,
} from "../replaceText";

describe( "SnippetEditor text utilities", () => {
	describe( "getTrigger", () => {
		it( "returns a % without spaces", () => {
			const actual = getTrigger( false, false );
			const expected = "%";

			expect( actual ).toBe( expected );
		} );

		it( "returns a % with a prepended space", () => {
			const actual = getTrigger( true, false );
			const expected = " %";

			expect( actual ).toBe( expected );
		} );

		it( "returns a % with a appended space", () => {
			const actual = getTrigger( false, true );
			const expected = "% ";

			expect( actual ).toBe( expected );
		} );

		it( "returns a % surrounded by spaces", () => {
			const actual = getTrigger( true, true );
			const expected = " % ";

			expect( actual ).toBe( expected );
		} );
	} );

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
		it( "returns the text that it is created with", () => {
			const expected = "The text of this block.";
			const content = ContentState.createFromText( expected );
			const editor = EditorState.createWithContent( content );
			const block = getAnchorBlock( editor.getCurrentContent(), editor.getSelection() );
			const actual = block.getText();

			expect( actual ).toBe( expected );
		} );
	} );

	describe( "insertText", () => {
		it( "equals the inserted text", () => {
			let editor = EditorState.createEmpty();
			const expected = "The text to insert.";

			editor = insertText( editor, expected );

			const content = editor.getCurrentContent();
			const actual = content.getPlainText();

			expect( actual ).toBe( expected );
		} );

		it( "inserts the text at the caret", () => {
			const expected = "This is a slightly more complicated text.\n" +
			                 "With just another line.";
			let content = ContentState.createFromText(
				"This is a slightly more complicated text.\n" +
				"With another line."
			);
			let editor = EditorState.createWithContent( content );
			const block = content.getLastBlock();
			const blockKey = block.getKey();

			editor = moveCaret( editor, 5, blockKey );
			editor = insertText( editor, "just " );

			content = editor.getCurrentContent();
			const actual = content.getPlainText();

			expect( actual ).toBe( expected );
		} );

		it( "ignores a request when the selection is not collapsed", () => {
			const expected = "This is the content.";
			let content = ContentState.createFromText( expected );
			let editor = EditorState.createWithContent( content );
			const block = content.getFirstBlock();
			const blockKey = block.getKey();
			const selection = SelectionState
				.createEmpty( blockKey )
				.merge( {
					anchorOffset: 8,
					focusOffset: 19,
				} );

			editor = EditorState.acceptSelection( editor, selection );
			editor = insertText( editor, "Text that will not get inserted" );

			content = editor.getCurrentContent();
			const actual = content.getPlainText();

			expect( actual ).toBe( expected );
		} );
	} );

	describe( "removeSelectedText", () => {
		it( "removes the selected text", () => {
			let content = ContentState.createFromText( "This is the content." );
			let editor = EditorState.createWithContent( content );
			const block = content.getFirstBlock();
			const blockKey = block.getKey();
			const selection = SelectionState
				.createEmpty( blockKey )
				.merge( {
					anchorOffset: 8,
					focusOffset: 19,
				} );

			editor = EditorState.acceptSelection( editor, selection );
			editor = removeSelectedText( editor );

			const expected = "This is .";
			content = editor.getCurrentContent();
			const actual = content.getPlainText();

			expect( actual ).toBe( expected );
		} );

		it( "removes the selected text spanning over multiple blocks", () => {
			let content = ContentState.createFromText(
				"This is a longer text.\n" +
				"With multiple lines.\n" +
				"In which we will expand the selection.\n" +
				"To just remove the selected text again."
			);
			let editor = EditorState.createWithContent( content );

			const blocks = content.getBlockMap().toArray();
			const anchorBlockKey = blocks[ 1 ].getKey();
			const focusBlockKey = blocks[ 3 ].getKey();
			const selection = SelectionState
				.createEmpty( anchorBlockKey )
				.merge( {
					anchorOffset: 5,
					focusKey: focusBlockKey,
					focusOffset: 28,
				} );

			editor = EditorState.acceptSelection( editor, selection );
			editor = removeSelectedText( editor );

			const expected = "This is a longer text.\n" +
			                 "With text again.";
			content = editor.getCurrentContent();
			const actual = content.getPlainText();

			expect( actual ).toBe( expected );
		} );
	} );

	describe( "moveCaret", () => {
		it( "moves the caret to the index", () => {
			const content = ContentState.createFromText(
				"This is a longer text.\n" +
				"With multiple lines.\n" +
				"To move the caret in."
			);
			let editor = EditorState.createWithContent( content );

			const blocks = content.getBlockMap().toArray();
			const blockKey = blocks[ 1 ].getKey();
			const selection = SelectionState.createEmpty( blockKey );
			const index = 5;

			editor = EditorState.acceptSelection( editor, selection );
			editor = moveCaret( editor, index );

			const expected = SelectionState
				.createEmpty( blockKey )
				.merge( {
					anchorOffset: index,
					focusOffset: index,
				} );
			const actual = editor.getSelection();

			expect( actual ).toEqual( expected );
		} );

		it( "moves the caret to the index of another block", () => {
			const content = ContentState.createFromText(
				"This is a longer text.\n" +
				"With multiple lines.\n" +
				"To move the caret in."
			);
			let editor = EditorState.createWithContent( content );

			const blocks = content.getBlockMap().toArray();
			const originalBlockKey = blocks[ 1 ].getKey();
			const selection = SelectionState.createEmpty( originalBlockKey );
			const moveToBlockKey = blocks[ 2 ].getKey();
			const index = 5;

			editor = EditorState.acceptSelection( editor, selection );
			editor = moveCaret( editor, index, moveToBlockKey );

			const expected = SelectionState
				.createEmpty( moveToBlockKey )
				.merge( {
					anchorOffset: index,
					focusOffset: index,
				} );
			const actual = editor.getSelection();

			expect( actual ).toEqual( expected );
		} );
	} );
} );
