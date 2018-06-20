import { EditorState } from "draft-js";

/**
 * Determines the start and end of a certain entity key.
 *
 * @param {ContentState} contentState The current content.
 * @param {string}       blockKey     The block key.
 * @param {number}       entity       The entity key.
 * @returns {Object} The start and end of the entity.
 */
export function getEntityRange( contentState, blockKey, entity ) {
	const block = contentState.getBlockForKey( blockKey );
	let entityRange = null;

	block.findEntityRanges(
		character => {
			return character.getEntity() === entity;
		},
		( start, end ) => {
			entityRange = { start, end };
		}
	);

	return entityRange;
}

/**
 * Determines the entity key at a certain position.
 *
 * @param {ContentState} contentState The current content.
 * @param {string}       blockKey     The block key.
 * @param {number}       position     The position to get the entity for.
 * @returns {?number} Entity key or null.
 */
export function getEntityAtPosition( contentState, blockKey, position ) {
	const block = contentState.getBlockForKey( blockKey );

	// Console.log( blockKey, contentState, block );
	let entity = block.getEntityAt( position );

	const { start } = getEntityRange( contentState, blockKey, entity );

	if ( start === position ) {
		return null;
	}

	return entity;
}

/**
 * Determines the correct property based on if a selection is backward.
 *
 * It is important to understand what the difference is between the anchor and
 * the focus in a selection.
 *
 * @link https://draftjs.org/docs/api-reference-selection-state.html#start-end-vs-anchor-focus
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Selection
 *
 * @param {boolean} isBackward Whether the selection is done backwards.
 * @returns {Object} The start and end offset properties.
 */
let getOffsetProperties = function( isBackward ) {
	let startOffsetProperty = "anchorOffset";
	let endOffsetProperty = "focusOffset";

	if ( isBackward ) {
		startOffsetProperty = "focusOffset";
		endOffsetProperty = "anchorOffset";
	}

	return { startOffsetProperty, endOffsetProperty };
};

/**
 * Returns if the entity is completely enclosed by the selection.
 *
 * @param {SelectionState} selection         The selection to check.
 * @param {Object}         entityRange       The entity positions.
 * @param {number}         entityRange.start The start position of the entity.
 * @param {number}         entityRange.end   The end position of the entity.
 * @returns {boolean} Whether the selection contains the entity.
 */
function selectionContainsEntity( selection, entityRange ) {
	const { start: startOfEntity, end: endOfEntity } = entityRange;

	return selection.getStartOffset() <= startOfEntity &&
	       selection.getEndOffset()   >= endOfEntity;
}

/**
 * Alters the selection to include the entity if the selection is inside the
 * entity.
 *
 * @param {SelectionState} selection         The current selection.
 * @param {SelectionState} previousSelection The selection before the onChange event.
 * @param {ContentState}   contentState      The current content state.
 * @returns {SelectionState} The new selection state.
 */
function alterSelection( selection, previousSelection, contentState ) {
	// DraftJS handles settings these properties to the correct value.
	let startOffset = selection.getStartOffset();
	let startBlock = selection.getStartKey();
	let endOffset = selection.getEndOffset();
	let endBlock = selection.getEndKey();

	let { startOffsetProperty, endOffsetProperty } = getOffsetProperties( selection.getIsBackward() );

	const startEntity = getEntityAtPosition( contentState, startBlock, startOffset );
	if ( startEntity !== null ) {
		const entityRange = getEntityRange( contentState, startBlock, startEntity );
		const { start: startOfEntity, end: endOfEntity } = entityRange;

		/*
		 * If the previous selection contained the entity and we now have it half-way
		 * selected that means we need to move the selection completely outside the
		 * entity.
		 */
		if ( selectionContainsEntity( previousSelection, entityRange ) ) {
			selection = selection.merge( {
				[ startOffsetProperty ]: endOfEntity,
			} );

		/*
		 * If the previous selection didn't contain the entity this means we are moving
		 * into it which means we should make sure the whole entity is selected.
		 */
		} else {
			selection = selection.merge( {
				[ startOffsetProperty ]: startOfEntity,
			} );
		}
	}

	const endEntity = getEntityAtPosition( contentState, endBlock, endOffset );
	if ( endEntity !== null ) {
		const entityRange = getEntityRange( contentState, startBlock, endEntity );
		const { start: startOfEntity, end: endOfEntity } = entityRange;

		/*
		 * If the previous selection contained the entity and we now have it half-way
		 * selected that means we need to move the selection completely outside the
		 * entity.
		 */
		if ( selectionContainsEntity( previousSelection, entityRange ) ) {
			selection = selection.merge( {
				[ endOffsetProperty ]: startOfEntity,
			} );

			/*
			 * If the previous selection didn't contain the entity this means we are moving
			 * into it which means we should make sure the whole entity is selected.
			 */
		} else {
			selection = selection.merge( {
				[ endOffsetProperty ]: endOfEntity,
			} );
		}
	}

	return selection;
}

/**
 * Selects a replacement variable completely when the selection is inside it.
 *
 * @param {EditorState} editorState The current state of the editor.
 * @param {EditorState} previousEditorState The state before the onChange event.
 * @returns {EditorState} The new state of the editor.
 */
export function selectReplacementVariables( editorState, previousEditorState ) {
	const selection = editorState.getSelection();
	const previousSelection = previousEditorState.getSelection();
	const contentState = editorState.getCurrentContent();

	// We are fixing the selection, but if it didn't change there is nothing to fix.
	if ( selection === previousSelection ) {
		return editorState;
	}

	const newSelection = alterSelection( selection, previousSelection, contentState );

	// If we always force a new selection we will trigger onChange events indefinitely.
	if ( newSelection !== selection ) {
		editorState = EditorState.forceSelection( editorState, newSelection );
	}

	return editorState;
}
