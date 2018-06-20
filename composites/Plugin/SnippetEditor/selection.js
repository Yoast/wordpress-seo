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

	const { start, end } = getEntityRange( contentState, blockKey, entity );

	if ( start === position ) {
		return null;
	}

	return entity;
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

	let newSelection = selection;

	// We are fixing the selection, but if it didn't change there is nothing to fix.
	if ( selection === previousSelection ) {
		return editorState;
	}

	const {
		anchorOffset,
		anchorKey,
		focusOffset,
		focusKey,
		isBackward,
	} = selection;

	const previousStartOffset = previousSelection.getStartOffset();
	const previousEndOffset = previousSelection.getEndOffset();

	let startOffset = anchorOffset;
	let startBlock = anchorKey;
	let endOffset = focusOffset;
	let endBlock = focusKey;
	let startOffsetProperty = "anchorOffset";
	let endOffsetProperty = "focusOffset";

	if ( isBackward ) {
		startOffset = focusOffset;
		startBlock = focusKey;
		endOffset = anchorOffset;
		endBlock = anchorKey;
		startOffsetProperty = "focusOffset";
		endOffsetProperty = "anchorOffset";
	}

	const startEntity = getEntityAtPosition( contentState, startBlock, startOffset );
	if ( startEntity !== null ) {
		const { start: startOfEntity, end: endOfEntity } = getEntityRange( contentState, startBlock, startEntity );

		/*
		 * If the previous selection contained the entity and we now have it half-way
		 * selected that means we need to move the selection completely outside the
		 * entity.
		 */
		if ( previousStartOffset <= startOfEntity && previousEndOffset >= endOfEntity ) {
			newSelection = newSelection.merge( {
				[ startOffsetProperty ]: endOfEntity,
			} );

		/*
		 * If the previous selection didn't contain the entity this means we are moving
		 * into it which means we should make sure the whole entity is selected.
		 */
		} else {
			newSelection = newSelection.merge( {
				[ startOffsetProperty ]: startOfEntity,
			} );
		}
	}

	const endEntity = getEntityAtPosition( contentState, endBlock, endOffset );
	if ( endEntity !== null ) {
		const { end: endOfEntity, start: startOfEntity } = getEntityRange( contentState, startBlock, endEntity );

		/*
		 * If the previous selection contained the entity and we now have it half-way
		 * selected that means we need to move the selection completely outside the
		 * entity.
		 */
		if ( previousStartOffset <= startOfEntity && previousEndOffset >= endOfEntity ) {
			newSelection = newSelection.merge( {
				[ endOffsetProperty ]: startOfEntity,
			} );

		/*
		 * If the previous selection didn't contain the entity this means we are moving
		 * into it which means we should make sure the whole entity is selected.
		 */
		} else {
			newSelection = newSelection.merge( {
				[ endOffsetProperty ]: endOfEntity,
			} );
		}
	}

	// If we always force a new selection we will trigger onChange events indefinitely.
	if ( newSelection !== selection ) {
		editorState = EditorState.forceSelection( editorState, newSelection );
	}

	return editorState;
}
