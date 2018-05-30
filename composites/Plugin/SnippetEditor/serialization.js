import reduce from "lodash/reduce";
import sortBy from "lodash/sortBy";
import { EditorState, Modifier, SelectionState, ContentState } from "draft-js";

const CIRCUMFIX = "%%";

const ENTITY_FORMAT = /%%([a-zA-Z_]+)%%/g;
const ENTITY_TYPE = "%mention";
const ENTITY_MUTABILITY = "IMMUTABLE";

/**
 * Serializes a tag into a string.
 *
 * @param {string} name The name of the tag.
 *
 * @returns {string} Serialized tag.
 */
export function serializeTag( name ) {
	return CIRCUMFIX + name + CIRCUMFIX;
}

/**
 * Serializes a Draft.js block into a string.
 *
 * @param {Object} entityMap Contains all the entities in the Draft.js editor.
 * @param {Object} block The block to serialize.
 *
 * @returns {string} The serialized block.
 */
export function serializeBlock( entityMap, block ) {
	const { text, entityRanges } = block;
	let previousEntityEnd = 0;

	// Ensure the entityRanges are in order from low to high offset.
	const sortedEntityRanges = sortBy( entityRanges, "offset" );
	let serialized = reduce( sortedEntityRanges, ( serialized, entityRange ) => {
		const { key, length, offset } = entityRange;
		const beforeEntityLength = offset - previousEntityEnd;

		const beforeEntity = text.substr( previousEntityEnd, beforeEntityLength );
		const serializedEntity = serializeTag( entityMap[ key ].data.mention.name );

		previousEntityEnd = offset + length;

		return serialized + beforeEntity + serializedEntity;
	}, "" );

	serialized += text.substr( previousEntityEnd );

	return serialized;
}

/**
 * Serializes the content inside a Draft.js editor.
 *
 * @param {Object} rawContent The content as returned by convertToRaw.
 *
 * @returns {string} The serialized content.
 */
export function serializeEditor( rawContent ) {
	const { blocks, entityMap } = rawContent;

	return reduce( blocks, ( serialized, block ) => {
		return serialized + serializeBlock( entityMap, block );
	}, "" );
}

/**
 * Determines the title for a given name.
 *
 * @param {Array} replacementVariables All the available replacment variables.
 * @param {string} name The name to find the title for.
 *
 * @returns {string} The title for this replacement variable.
 */
export function getReplacementVariableTitle( replacementVariables, name ) {
	let title = name;

	replacementVariables.forEach( ( replacementVariable ) => {
		if ( replacementVariable.name === name && replacementVariable.title ) {
			title = replacementVariable.title;
		}
	} );

	return title;
}

/**
 * Finds replacement variables in a piece of content.
 *
 * Returns an array with all strings that match `%%[tag]%%`.
 *
 * @param {string} content The content to find replacement variables in.
 *
 * @returns {Array} The found variables and their positions.
 */
export function findReplacementVariables( content ) {
	const variables = [];
	let replacementVariable;

	while ( ( replacementVariable = ENTITY_FORMAT.exec( content ) ) ) {
		const [ match, name ] = replacementVariable;

		variables.push( {
			name,
			start: replacementVariable.index,
			length: match.length,
		} );
	}

	return variables;
}

/**
 * Adds title to a variable.
 *
 * @param {Object} variable Details about the variable we are replacing.
 * @param {Array} replacementVariables All the available replacement variables.
 *
 * @returns {Object} The variable with its title.
 */
export function addTitle( variable, replacementVariables ) {
	return {
		...variable,
		title: getReplacementVariableTitle( replacementVariables, variable.name ),
	};
}

/**
 * Adds position information about a variable inside a block.
 *
 * @param {Object} variable Details about the variable we are replacing.
 * @param {number} offset The offset we need to add because of other replacements.
 *
 * @returns {Object} The variable with position information.
 */
export function addPositionInformation( variable, offset ) {
	return {
		...variable,
		start: variable.start + offset,
		end: variable.start + variable.length + offset,
		delta: variable.title.length - variable.length,
	};
}

/**
 * Changes a selection object to represent the selection after replacement.
 *
 * @param {SelectionState} selection The previous selection state.
 * @param {string} blockKey The key of the block we are working in.
 * @param {Object} variable Details about the variable we are replacing.
 *
 * @returns {SelectionState} The new selection state.
 */
export function moveSelectionAfterReplacement( selection, blockKey, variable ) {
	const { start, end, delta } = variable;

	/*
	 * If the selection touches the replacement we are doing we always move the
	 * cursor to the end of the entity once it is replaced.
	 *
	 * This is probably not always correct, but it works easy and it feels right
	 * when using the editor.
	 */
	if ( selection.hasEdgeWithin( blockKey, start, end ) ) {
		const newEnd = end + delta;

		selection = selection.merge( {
			anchorOffset: newEnd,
			focusOffset: newEnd,
		} );

		/*
		 * If the selection is after the thing we are replacing, we need to move the
		 * selection the same amount
		 */
	} else if ( selection.focusOffset > end ) {
		selection = selection.merge( {
			anchorOffset: selection.anchorOffset + delta,
			focusOffset: selection.focusOffset + delta,
		} );
	}

	return selection;
}

/**
 * Creates a DraftJS entity in a content state.
 *
 * @param {ContentState} contentState The previous content state.
 * @param {Object} variable Details about the variable we are replacing.
 *
 * @returns {ContentState} The new content state.
 */
export function createEntityInContent( contentState, variable ) {
	const entityData = {
		mention: {
			name: variable.name,
		},
	};

	return contentState.createEntity( ENTITY_TYPE, ENTITY_MUTABILITY, entityData );
}

/**
 * Replaces a replacement variable in the editor with an entity representing it.
 *
 * @param {EditorState} editorState The previous editor state.
 * @param {Object} variable Details about the variable we are replacing.
 * @param {string} blockKey The key of the block we are working in.
 *
 * @returns {EditorState} The new editor state.
 */
export function replaceVariableWithEntity( editorState, variable, blockKey ) {
	let contentState = editorState.getCurrentContent();

	// Create a selection that spans the `%%replacement_variable%%` in the text.
	const variableTextSelection = SelectionState.createEmpty( blockKey )
		.merge( {
			anchorOffset: variable.start,
			focusOffset: variable.end,
		} );

	// We need to create the entity before replacing text with it.
	contentState = createEntityInContent( contentState, variable );

	/*
	 * Do the actual replacement.
	 *
	 * We replace `%%replacement_variable%%` with an entity. The entity is already
	 * created in the content state. So we can refer to it by using
	 * `contentState.getLastCreatedEntityKey`.
	 */
	const newContentState = Modifier.replaceText(
		contentState,
		variableTextSelection,
		variable.title,
		// No inline style needed.
		null,
		contentState.getLastCreatedEntityKey(),
	);

	// We need to apply the new content state to the editor state.
	return EditorState.push( editorState, newContentState, "apply-entity" );
}

/**
 * Replaces replacement variables (%%tags%%) in an editor state with entities.
 *
 * @param {EditorState} editorState          The editor state to find the variables in.
 * @param {Array}       replacementVariables The available replacement variables, used
 *                                           to determine the title in the entities.
 *
 * @returns {EditorState} The new editor state with entities.
 */
export function replaceReplacementVariables( editorState, replacementVariables ) {
	const contentState = editorState.getCurrentContent();
	const blockMap = contentState.getBlockMap();
	let newEditorState = editorState;

	/*
	 * Because we do this for each block our code will work for multiple blocks even if
	 * we currently usually only have one block.
	 */
	blockMap.forEach( ( block ) => {
		const { text, key: blockKey } = block;
		const foundReplacementVariables = findReplacementVariables( text );

		/*
		 * Offset keeps track of the amount of shifting that occured by replacing
		 * replacement variables with entities. This makes sure multiple replacement
		 * variables are replaced correctly.
		 */
		let offset = 0;

		foundReplacementVariables.forEach( ( variable ) => {
			variable = addTitle( variable, replacementVariables );
			variable = addPositionInformation( variable, offset );

			let selection = newEditorState.getSelection();
			selection = moveSelectionAfterReplacement( selection, blockKey, variable );

			newEditorState = replaceVariableWithEntity( newEditorState, variable, blockKey );
			newEditorState = EditorState.acceptSelection( newEditorState, selection );

			offset = offset + variable.delta;
		} );
	} );

	return newEditorState;
}

/**
 * Unserializes a piece of content into Draft.js data.
 *
 * @param {string} content The content to unserialize.
 * @param {Array} tags The tags for the Draft.js mention plugin.
 *
 * @returns {EditorState} The raw data ready for convertFromRaw.
 */
export function unserializeEditor( content, tags ) {
	const editorState = EditorState.createWithContent( ContentState.createFromText( content ) );

	return replaceReplacementVariables( editorState, tags );
}
