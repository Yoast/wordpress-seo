import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalTypeaheadMenuPlugin, useBasicTypeaheadTriggerMatch } from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import { $createTextNode, $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR, createCommand } from "lexical";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { PickerMenu } from "../picker";
import { $createReplacementNode, ReplacementNode } from "./replacement-node";

/**
 * @typedef ReplacementItem
 * @property {string} name The name of the node.
 * @property {string} label The label of the node.
 * @property {Object} [data] Optional extra data of the node.
 * @property {Object} [__metadata] Metadata for internal purposes.
 */

const INSERT_REPLACEMENT_COMMAND = createCommand( "insert-replacement" );

/**
 * @param {ReplacementItem[]} items The items to pick from.
 * @param {string|null} query The query to filter the items.
 * @param {number} [maxItems=0] The maximum amount of items. If <= 0, all items are returned.
 * @returns {ReplacementItem[]} The filtered items.
 */
const useFilter = ( items, query, maxItems = 0 ) => useMemo(
	() => {
		if ( ! query ) {
			return items;
		}
		const q = query.toLowerCase();
		const result = items.filter( ( item ) => item.name.toLowerCase().includes( q ) || item.label.toLowerCase().includes( q ) );
		if ( maxItems > 0 ) {
			return result.slice( 0, maxItems );
		}
		return result;
	},
	[ items, query ],
);

/**
 * @param {React.MutableRefObject<HTMLElement>} anchorRef The anchor ref.
 * @param {Object} props The item props.
 * @param {PickerOption[]} props.options The options.
 * @param {number} props.selectedIndex The selected index.
 * @param {function} props.selectOptionAndCleanUp Selects the option.
 * @param {function} props.setHighlightedIndex Sets the highlighted index.
 * @param {string} queryString The query string.
 * @returns {React.ReactPortal|null} The portal.
 */
const renderPickerMenu = ( anchorRef, { options, selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }, queryString ) => {
	if ( anchorRef.current === null || options.length === 0 ) {
		return null;
	}

	return anchorRef.current && options.length
		? createPortal(
			<PickerMenu
				options={ options }
				selectedIndex={ selectedIndex }
				selectOption={ selectOptionAndCleanUp }
				setHighlightedIndex={ setHighlightedIndex }
				queryString={ queryString }
			/>,
			anchorRef.current,
		)
		: null;
};

/**
 * @param {ReplacementItem[]} items The items to pick from.
 * @param {string} trigger The trigger to start the search.
 * @param {number} minLength The minimum length to start a search.
 * @param {number} maxLength The maximum length to keep searching.
 * @param {number} maxSuggestions The maximum amount of suggestions to show.
 * @param {boolean} addSpace Whether to add a space after the replacement.
 * @param {function|null} transformItemToText Transforms an item to text content.
 * @param {function|null} transformItemToEditor Transforms an item to JSX element.
 * @returns {JSX.Element} The element.
 */
const ReplacementPlugin = ( {
	items,
	trigger = "%%",
	minLength = 1,
	maxLength = 75,
	maxSuggestions = 10,
	addSpace = true,
	transformItemToText = null,
	transformItemToEditor = null,
} ) => {
	const [ editor ] = useLexicalComposerContext();
	const [ query, setQuery ] = useState( null );

	const checkForTriggerMatch = useBasicTypeaheadTriggerMatch( trigger, { minLength, maxLength } );
	const defaultTransformItemToText = useCallback( ( item ) => `${ trigger }${ item.getName() }${ trigger }`, [ trigger ] );
	const defaultTransformItemToEditor = useCallback( ( item ) => <>{ item.getLabel() }</>, [] );
	const transformedItems = useMemo( () => items.map( ( item ) => ( {
		...item,
		__metadata: {
			// Add formatter to the data, so we can influence it depending on props from here.
			getTextContent: typeof transformItemToText === "function" ? transformItemToText : defaultTransformItemToText,
			getEditorContent: typeof transformItemToEditor === "function" ? transformItemToEditor : defaultTransformItemToEditor,
		},
	} ) ), [ items, transformItemToText, defaultTransformItemToText, transformItemToEditor, defaultTransformItemToEditor ] );
	const options = useFilter( transformedItems, query, maxSuggestions );

	const handleSelectOption = useCallback(
		( selectedOption, nodeToRemove, closeMenu ) => {
			editor.update( () => {
				const selection = $getSelection();
				if ( ! $isRangeSelection( selection ) || selectedOption === null ) {
					return;
				}
				if ( nodeToRemove ) {
					nodeToRemove.remove();
				}
				const nodes = [ $createReplacementNode( selectedOption ) ];
				if ( addSpace ) {
					nodes.push( $createTextNode( " " ) );
				}
				selection.insertNodes( nodes );
				closeMenu();
			} );
		},
		[ editor.update ],
	);

	useEffect( () => {
		if ( ! editor.hasNodes( [ ReplacementNode ] ) ) {
			throw new Error( "ReplacementPlugin: ReplacementNode not registered on editor (initialConfig.nodes)" );
		}

		return editor.registerCommand(
			INSERT_REPLACEMENT_COMMAND,
			( payload ) => {
				$insertNodeToNearestRoot( $createReplacementNode( payload ) );

				return true;
			},
			COMMAND_PRIORITY_EDITOR,
		);
	}, [ editor.hasNodes, editor.registerCommand ] );

	return (
		<LexicalTypeaheadMenuPlugin
			onQueryChange={ setQuery }
			onSelectOption={ handleSelectOption }
			triggerFn={ checkForTriggerMatch }
			options={ options }
			menuRenderFn={ renderPickerMenu }
		/>
	);
};

export {
	$createReplacementNode,
	ReplacementNode,
	ReplacementPlugin,
};
