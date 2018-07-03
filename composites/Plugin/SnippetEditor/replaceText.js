import { EditorState, SelectionState, Modifier } from "draft-js";

/**
 * Creates the trigger string that is needed to show the replacement variable suggestions.
 *
 * The Draft.js mention plugin trigger is set as %. But the suggestions popover only shows
 * when the characters before and after the % are whitespace.
 *
 * @param {boolean} needsPrependedSpace When true, a space is prepended.
 * @param {boolean} needsAppendedSpace  When true, a space is appended.
 *
 * @returns {string} The trigger string.
 */
export const getTrigger = ( needsPrependedSpace, needsAppendedSpace ) => {
	let trigger = "%";

	if ( needsPrependedSpace ) {
		trigger = " " + trigger;
	}
	if ( needsAppendedSpace ) {
		trigger += " ";
	}
	return trigger;
};

/**
 * Tests if a character in a text is whitespace. Out of range index counts as whitespace.
 *
 * @param {string} text  The text to get the character from.
 * @param {number} index The index of the character in the text.
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
 * @returns {number} The Draft.js caret offset.
 */
export const getCaretOffset = ( selection ) => {
	const isBackward = selection.getIsBackward();

	// If the selection is backwards the end offset is the caret.
	return isBackward ? selection.getEndOffset() : selection.getStartOffset();
};

/**
 * Gets the block of the start of the current Draft.js selection.
 *
 * This is a tiny helper function to get the Draft.js selection anchor key and
 * then the block of that key.
 * Read more about the Draft.js selection state: https://draftjs.org/docs/api-reference-selection-state.html
 * Read more about the Draft.js content block: https://draftjs.org/docs/api-reference-content-block.html
 *
 * @param {ContentState}   contentState   The Draft.js content state.
 * @param {SelectionState} selectionState The Draft.js selection state.
 *
 * @returns {ContentBlock} The Draft.js ContentBlock.
 */
export const getAnchorBlock = ( contentState, selectionState ) => {
	const key = selectionState.getAnchorKey();
	return contentState.getBlockForKey( key );
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
	const contentState = editorState.getCurrentContent();
	const selectionState = editorState.getSelection();

	// If there is a selection instead of a caret do nothing.
	if ( ! selectionState.isCollapsed() ) {
		return editorState;
	}

	const newContentState = Modifier.insertText( contentState, selectionState, text );
	return EditorState.push( editorState, newContentState, "insert-characters" );
};

/**
 * Removes the selected text in the editor state.
 *
 * @param {EditorState} editorState The Draft.js editor state.
 *
 * @returns {EditorState} The new editor state.
 */
export const removeSelectedText = ( editorState ) => {
	const contentState = editorState.getCurrentContent();
	const selectionState = editorState.getSelection();

	const newContent = Modifier.removeRange( contentState, selectionState, "backward" );
	return EditorState.push( editorState, newContent, "remove-range" );
};

/**
 * Moves the caret to the index.
 *
 * @param {EditorState} editorState The Draft.js editor state,
 * @param {number}      caretIndex  The index of the caret to be.
 * @param {string}      blockKey    The key for the block to move the caret too. Defaults to current.
 *
 * @returns {EditorState} The new editor state.
 */
export const moveCaret = ( editorState, caretIndex, blockKey = "" ) => {
	const contentState = editorState.getCurrentContent();
	const selectionState = editorState.getSelection();

	// Default to the block where the anchor is currently at.
	if ( blockKey === "" ) {
		blockKey = getAnchorBlock( contentState, selectionState ).getKey();
	}

	const newSelectionState = SelectionState
		.createEmpty( blockKey )
		.merge( {
			anchorOffset: caretIndex,
			focusOffset: caretIndex,
		} );

	return EditorState.acceptSelection( editorState, newSelectionState );
};
