import { EditorState } from "draft-js";

/**
 * Determines the start and end of a certain entity key.
 *
 * @param {ContentState} contentState The current content.
 * @param {string}       blockKey     The block key.
 * @param {number}       entityKey    The entity key.
 *
 * @returns {Object} The start and end of the entity.
 */
export function getEntityRange( contentState, blockKey, entityKey ) {
	const block = contentState.getBlockForKey( blockKey );
	let entityRange = null;

	block.findEntityRanges(
		character => {
			return character.getEntity() === entityKey;
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
 *
 * @returns {?number} Entity key or null.
 */
export function getEntityAtPosition( contentState, blockKey, position ) {
	const block = contentState.getBlockForKey( blockKey );

	const entity = block.getEntityAt( position );
	const entityRange = getEntityRange( contentState, blockKey, entity );

	if ( entityRange === null ) {
		return null;
	}

	/*
	 * The cursor is before a character with the same position.
	 *
	 * For example when the cursor is before the e here:
	 *
	 * ```
	 * Text
	 *  ^
	 * ```
	 *
	 * If an entity would start with the `e` then the cursor isn't actually in the
	 * entity yet. So we check if the position is equal to the start of the entity
	 * we exclude it.
	 */
	if ( entityRange.start === position ) {
		return null;
	}

	return entity;
}

/**
 * Determines the correct offset properties based on if a selection is backward.
 *
 * It is important to understand what the difference is between the anchor and
 * the focus in a selection.
 *
 * @link https://draftjs.org/docs/api-reference-selection-state.html#start-end-vs-anchor-focus
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Selection
 *
 * @param {boolean} isBackward Whether the selection is done backwards.
 *
 * @returns {Object} The start and end offset properties.
 */
const getOffsetProperties = function( isBackward ) {
	let startOffsetProperty = "anchorOffset";
	let endOffsetProperty = "focusOffset";

	if ( isBackward ) {
		startOffsetProperty = "focusOffset";
		endOffsetProperty = "anchorOffset";
	}

	return { startOffsetProperty, endOffsetProperty };
};

/**
 * Returns whether the entity is completely enclosed by the selectionState.
 *
 * @param {SelectionState} selectionState    The selectionState to check.
 * @param {Object}         entityRange       The entity positions.
 * @param {number}         entityRange.start The start position of the entity.
 * @param {number}         entityRange.end   The end position of the entity.
 *
 * @returns {boolean} Whether the selectionState contains the entity.
 */
function selectionContainsEntity( selectionState, entityRange ) {
	const { start: startOfEntity, end: endOfEntity } = entityRange;

	return selectionState.getStartOffset() <= startOfEntity &&
	       selectionState.getEndOffset()   >= endOfEntity;
}

/**
 * Alters the selectionState to include the entity if the selectionState is inside the
 * entity.
 *
 * @param {SelectionState} selectionState    The current selectionState.
 * @param {SelectionState} previousSelection The selectionState before the onChange event.
 * @param {ContentState}   contentState      The current content state.
 *
 * @returns {SelectionState} The new selectionState state.
 */
function alterSelection( selectionState, previousSelection, contentState ) {
	// DraftJS handles settings these properties to the correct value.
	const startOffset = selectionState.getStartOffset();
	const startBlock = selectionState.getStartKey();
	const endOffset = selectionState.getEndOffset();
	const endBlock = selectionState.getEndKey();

	const { startOffsetProperty, endOffsetProperty } = getOffsetProperties( selectionState.getIsBackward() );

	const startEntity = getEntityAtPosition( contentState, startBlock, startOffset );
	if ( startEntity !== null ) {
		const entityRange = getEntityRange( contentState, startBlock, startEntity );
		const { start: startOfEntity, end: endOfEntity } = entityRange;

		/*
		 * If the previous selectionState contained the entity and we now have it half-way
		 * selected that means we need to move the selectionState completely outside the
		 * entity.
		 */
		if ( selectionContainsEntity( previousSelection, entityRange ) ) {
			selectionState = selectionState.merge( {
				[ startOffsetProperty ]: endOfEntity,
			} );

		/*
		 * If the previous selectionState didn't contain the entity this means we are moving
		 * into it which means we should make sure the whole entity is selected.
		 */
		} else {
			selectionState = selectionState.merge( {
				[ startOffsetProperty ]: startOfEntity,
			} );
		}
	}

	const endEntity = getEntityAtPosition( contentState, endBlock, endOffset );
	if ( endEntity !== null ) {
		const entityRange = getEntityRange( contentState, startBlock, endEntity );
		const { start: startOfEntity, end: endOfEntity } = entityRange;

		/*
		 * If the previous selectionState contained the entity and we now have it half-way
		 * selected that means we need to move the selectionState completely outside the
		 * entity.
		 */
		if ( selectionContainsEntity( previousSelection, entityRange ) ) {
			selectionState = selectionState.merge( {
				[ endOffsetProperty ]: startOfEntity,
			} );

		/*
		 * If the previous selectionState didn't contain the entity this means we are moving
		 * into it which means we should make sure the whole entity is selected.
		 */
		} else {
			selectionState = selectionState.merge( {
				[ endOffsetProperty ]: endOfEntity,
			} );
		}
	}

	return selectionState;
}

/**
 * Selects a replacement variable completely when the selection is inside it.
 *
 * @param {EditorState} editorState         The current state of the editor.
 * @param {EditorState} previousEditorState The state before the onChange event.
 *
 * @returns {EditorState} The new state of the editor.
 */
export function selectReplacementVariables( editorState, previousEditorState ) {
	const selectionState = editorState.getSelection();
	const previousSelection = previousEditorState.getSelection();
	const contentState = editorState.getCurrentContent();

	/*
	 * We are moving the selectionState, but if it didn't change there is nothing to
	 * move. It would have already been moved the previous time the selectionState
	 * changed.
	 */
	if ( selectionState === previousSelection ) {
		return editorState;
	}

	const newSelection = alterSelection( selectionState, previousSelection, contentState );

	// If we always force a new selectionState, we would trigger onChange events indefinitely.
	if ( newSelection !== selectionState ) {
		editorState = EditorState.forceSelection( editorState, newSelection );
	}

	return editorState;
}
