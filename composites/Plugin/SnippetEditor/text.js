import { EditorState, SelectionState, Modifier } from "draft-js";

/**
 * Test if a character in a text is whitespace. Out of range index counts as whitespace.
 *
 * @param {string} text  The text to get the character from.
 * @param {int}    index The index of the character in the text.
 *
 * @returns {boolean} True if the character is out of bounds or whitespace.
 */
export const hasWhitespaceAt = ( text, index ) => {
	const char = text.charAt( index );

	// No character found equals whitespace.
	if ( char.length === 0 ) {
		return true;
	}

	return /\s/.test( char );
};

/**
 * Gets the Draft.js caret offset.
 *
 * @param {SelectionState} selection The Draft.js selection state.
 *
 * @returns {int} The Draft.js caret offset.
 */
export const getCaretOffset = ( selection ) => {
	const isBackward = selection.getIsBackward();

	// If the selection is backwards the end offset is the caret.
	return isBackward ? selection.getEndOffset() : selection.getStartOffset();
};

/**
 * Gets the block of the current Draft.js selection.
 *
 * @param {ContentState}   content   The Draft.js content state.
 * @param {SelectionState} selection The Draft.js selection state.
 *
 * @returns {ContentBlock} The Draft.js ContentBlock.
 */
export const getAnchorBlock = ( content, selection ) => {
	const key = selection.getAnchorKey();
	return content.getBlockForKey( key );
};

/**
 * Replaces current selection with text.
 *
 * @param {EditorState} editorState The Draft.js editor state.
 * @param {string}      text        The text to insert.
 *
 * @returns {EditorState} The new editor state.
 */
export const replaceText = ( editorState, text ) => {
	const content = editorState.getCurrentContent();
	const selection = editorState.getSelection();

	const newContent = Modifier.replaceText( content, selection, text );
	return EditorState.push( editorState, newContent, "insert-characters" );
};

/**
 * Inserts text into the editor state.
 *
 * @param {EditorState} editorState The Draft.js editor state.
 * @param {string}      text        The text to insert.
 *
 * @returns {EditorState} The new editor state.
 */
export const insertText = ( editorState, text ) => {
	const content = editorState.getCurrentContent();
	const selection = editorState.getSelection();

	// If there is a selection instead of a caret do nothing.
	if ( ! selection.isCollapsed() ) {
		return editorState;
	}

	const newContent = Modifier.insertText( content, selection, text );
	return EditorState.push( editorState, newContent, "insert-characters" );
};

/**
 * Removes the selected text in the editor state.
 *
 * @param {EditorState} editorState The Draft.js editor state.
 *
 * @returns {EditorState} The new editor state.
 */
export const removeSelectedText = ( editorState ) => {
	const content = editorState.getCurrentContent();
	const selection = editorState.getSelection();

	const newContent = Modifier.removeRange( content, selection, "backward" );
	return EditorState.push( editorState, newContent, "remove-range" );
};

/**
 * Moves the caret to the index.
 *
 * @param {EditorState} editorState The Draft.js editor state,
 * @param {int}         index       The index of the caret to be.
 * @param {string}      blockKey    The key for the block to move the caret too. Defaults to current.
 *
 * @returns {EditorState} The new editor state.
 */
export const moveCaret = ( editorState, index, blockKey = "" ) => {
	const content = editorState.getCurrentContent();
	const selection = editorState.getSelection();

	// Default to the block where the anchor is currently at.
	if ( blockKey === "" ) {
		blockKey = getAnchorBlock( content, selection ).getKey();
	}

	const newSelection = SelectionState.createEmpty( blockKey )
	                                   .merge( {
		                                   anchorOffset: index,
		                                   focusOffset: index,
	                                   } );

	return EditorState.acceptSelection( editorState, newSelection );
};
