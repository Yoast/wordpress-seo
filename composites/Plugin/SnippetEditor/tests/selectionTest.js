import { unserializeEditor } from "../serialization";
import { EditorState, SelectionState } from "draft-js";
import { selectReplacementVariables } from "../selection";

/*
 * We're using the brackets here to make it easier to visualize where the selection
 * is and should be at certain points.
 *
 * - `before` is the selection state before the editor `onChange`.
 * - `after` is the selection state after/during the editor `onChange`.
 * - `expected` is the selection state the function should result in.
 */

/**
 * Converts a visualizable text to a DraftJS SelectionState.
 *
 * @param {string}      text        The text to convert.
 * @param {string}      blockKey    The key of the block the selection is on.
 * @param {EditorState} editorState The editor state to put the selection on.
 * @param {boolean}     backwards   Whether the selection is backwards or not.
 * @returns {SelectionState} The converted selection state.
 */
function convertToState( text, blockKey, editorState, backwards = false ) {
	const start = text.indexOf( "[" );
	text = text.replace( "[", "" );
	const end = text.indexOf( "]" );
	text = text.replace( "]", "" );

	let anchorOffset = start;
	let focusOffset = end;
	if ( backwards ) {
		anchorOffset = end;
		focusOffset = start;
	}

	const selection = new SelectionState( {
		anchorKey: blockKey,
		anchorOffset,
		focusKey: blockKey,
		focusOffset,
		hasFocus: true,
		isBackward: backwards,
	} );

	return EditorState.acceptSelection( editorState, selection );
}

/**
 * Converts a selection to a piece of text for easier visualization.
 *
 * This is used to make the errors in the tests look something like this:
 * Expected value to equal:
 *      "Te[xt ]entity entity Text"
 * Received:
 *      "Te[xt] entity entity Text"
 *
 * Which is much easier to debug.
 *
 * @param {string} text Text to put the selection brackets in.
 * @param {SelectionState} selection The selection.
 * @returns {string} Text with brackets to represent the selection.
 */
function convertFromState( text, selection ) {
	const start = selection.getStartOffset();
	const end = selection.getEndOffset();

	text = text.slice( 0, start ) + "[" + text.slice( start, end ) + "]" + text.slice( end );

	return text;
}

/**
 * Tests the selectReplacementVariables function.
 *
 * @param {Object} args The arguments with which to test.
 * @param {string} args.before   The editor state before the onChange,
 *                               represented as text.
 * @param {string} args.after    The editor state after/during the onChange,
 *                               represented as text.
 * @param {string} args.expected The expected state the function should return,
 *                               represented as text.
 * @returns {void}
 */
function expectToMatch( args ) {
	const { before: beforeText, after: afterText, expected: expectedText, backwards = false } = args;

	const text = "Text %%entity%% %%entity%% Text";
	const editorState = unserializeEditor( text, [ { name: "entity", value: "EntityValue" } ] );
	const key = editorState.getCurrentContent().getFirstBlock().getKey();

	const before = convertToState( beforeText, key, editorState, backwards );
	const after = convertToState( afterText, key, editorState, backwards );
	const expected = convertToState( expectedText, key, editorState, backwards );

	const actual = selectReplacementVariables( after, before );
	const actualText = convertFromState( "Text entity entity Text", actual.getSelection() );

	expect( actualText ).toEqual( expectedText );
	expect( actual.getSelection() ).toEqual( expected.getSelection() );

	if ( backwards === false ) {
		expectToMatch( { ...args, backwards: true } );
	}
}

describe( "selection behavior", () => {
	it( "selects the whole entity when selecting a small part from the right", () => {
		expectToMatch( {
			before: "Text entity[] entity Text",
			after: "Text entit[y] entity Text",
			expected: "Text [entity] entity Text",
		} );
	} );

	it( "selects the whole entity when selecting a small part from the left", () => {
		expectToMatch( {
			before: "Text []entity entity Text",
			after: "Text [e]ntity entity Text",
			expected: "Text [entity] entity Text",
		} );
	} );

	it( "selects an entity when trying to move into it from the left", () => {
		expectToMatch( {
			before: "Text []entity entity Text",
			after: "Text e[]ntity entity Text",
			expected: "Text [entity] entity Text",
		} );
	} );

	it( "selects an entity when trying to move into it from the right", () => {
		expectToMatch( {
			before: "Text entity[] entity Text",
			after: "Text entit[]y entity Text",
			expected: "Text [entity] entity Text",
		} );
	} );

	it( "selects the whole entity when clicking it", () => {
		expectToMatch( {
			before: "[]Text entity entity Text",
			after: "Text ent[]ity entity Text",
			expected: "Text [entity] entity Text",
		} );
	} );

	it( "selects multiple entities when selecting half-way", () => {
		expectToMatch( {
			before: "[]Text entity entity Text",
			after: "Text ent[ity ent]ity Text",
			expected: "Text [entity entity] Text",
		} );
	} );

	it( "moves out of selection when pressing arrow keys", () => {
		expectToMatch( {
			before: "Text entity [entity] Text",
			after: "Text entity []entity Text",
			expected: "Text entity []entity Text",
		} );

		expectToMatch( {
			before: "Text entity [entity] Text",
			after: "Text entity entity[] Text",
			expected: "Text entity entity[] Text",
		} );
	} );

	it( "allows selection to be moved out of the entity", () => {
		expectToMatch( {
			before: "Te[xt entity] entity Text",
			after: "Te[xt entit]y entity Text",
			expected: "Te[xt ]entity entity Text",
		} );

		expectToMatch( {
			before: "Text entity [entity Te]xt",
			after: "Text entity e[ntity Te]xt",
			expected: "Text entity entity[ Te]xt",
		} );

		// When using something like Alt+Shift+arrow right/left
		expectToMatch( {
			before: "Te[xt entity] entity Text",
			after: "Te[xt ]entity entity Text",
			expected: "Te[xt ]entity entity Text",
		} );

		expectToMatch( {
			before: "Text entity [entity Te]xt",
			after: "Text entity entity[ Te]xt",
			expected: "Text entity entity[ Te]xt",
		} );
	} );

	it( "doesn't alter the selection if it wasn't changed in the first place", () => {
		const text = "Text %%entity%% %%entity%% Text";
		const beforeText = "[Text entity entity Text]";
		const editorState = unserializeEditor( text, [ { name: "entity", value: "EntityValue" } ] );
		const key = editorState.getCurrentContent().getFirstBlock().getKey();

		const before = convertToState( beforeText, key, editorState );
		const after = before;
		const expected = before;

		const actual = selectReplacementVariables( after, before );

		expect( actual ).toBe( expected );
	} );
} );
