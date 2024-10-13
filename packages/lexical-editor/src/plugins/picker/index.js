import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalTypeaheadMenuPlugin, MenuOption, useBasicTypeaheadTriggerMatch } from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { $createTextNode, $getSelection, $isRangeSelection } from "lexical";
import * as React from "react";
import { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";

/**
 * @typedef Item
 * @property {string} name The name.
 * @property {string} label The label to show in the editor.
 * @property {string[]} [keywords=[]] Optional keywords to use in search.
 * @property {Object} [data={}] Optional extra data.
 */

/**
 * Represents an option to pick from.
 */
class PickerOption extends MenuOption {
	/**
	 * @param {Item} item The item.
	 */
	constructor( { name, label, keywords = [], data = {} } ) {
		super( name );
		this.name = name;
		this.label = label;
		this.keywords = keywords;
		this.data = data;
	}
}

/**
 * @param {Item[]} items The items.
 * @returns {PickerOption[]} The options.
 */
const useTransformItemsToOptions = ( items = [] ) => useMemo(
	() => items.map( ( item ) => new PickerOption( item ) ),
	[ items ],
);

/**
 * @param {PickerOption[]} options The options.
 * @param {number|null} selectedIndex The selected index.
 * @param {function} selectOption Selects the option.
 * @param {function} setHighlightedIndex Sets the highlighted index.
 * @returns {JSX.Element} The element.
 */
export const PickerMenu = ( { options, selectedIndex, selectOption, setHighlightedIndex } ) => (
	<div className="yst-picker-menu typeahead-popover">
		<ul>
			{ options.map( ( option, index ) => (
				<PickerMenuItem
					key={ option.name }
					index={ index }
					isSelected={ selectedIndex === index }
					onSelect={ selectOption }
					onHighlight={ setHighlightedIndex }
					option={ option }
				/>
			) ) }
		</ul>
	</div>
);

/**
 * @param {PickerOption} option The option.
 * @param {number} index The index.
 * @param {boolean} isSelected Whether currently selected.
 * @param {function} onSelect Callback to select.
 * @param {function} onHighlight Callback to highlight.
 * @returns {JSX.Element} The element.
 */
const PickerMenuItem = ( { option, index, isSelected, onSelect, onHighlight } ) => {
	const handleClick = useCallback( () => {
		onHighlight( index );
		onSelect( option );
	}, [ onHighlight, onSelect, option, index ] );
	const handleMouseEnter = useCallback( () => {
		onHighlight( index );
	}, [ onHighlight, index ] );
	const handleKeyDown = useCallback( ( event ) => {
		switch ( event.key ) {
			case "Enter":
				handleClick();
				break;
		}
	}, [ handleClick ] );

	return (
		<li
			key={ option.name }
			tabIndex={ -1 }
			className={ `yst-picker-item${ isSelected ? " selected" : "" }` }
			ref={ option.setRefElement }
			role="option"
			aria-selected={ isSelected }
			onClick={ handleClick }
			onMouseEnter={ handleMouseEnter }
			onKeyDown={ handleKeyDown }
		>
			{ option.label }
		</li>
	);
};

/**
 * @param {Item[]} items The items to pick from.
 * @param {string} trigger The trigger to start the search.
 * @param {number} minLength The minimum length to start a search.
 * @param {number} maxLength The maximum length to keep searching.
 * @param {number} maxSuggestions The maximum amount of suggestions to show.
 * @returns {JSX.Element} The element.
 */
export const PickerPlugin = ( { items, trigger, minLength = 1, maxLength = 75, maxSuggestions = 10 } ) => {
	const [ editor ] = useLexicalComposerContext();
	const [ query, setQuery ] = useState( null );

	const checkForTriggerMatch = useBasicTypeaheadTriggerMatch( trigger, { minLength, maxLength } );

	const pickerOptions = useTransformItemsToOptions( items );
	const filteredOptions = useMemo(
		() => pickerOptions
			.filter( ( option ) => query === null
				? pickerOptions
				: query.exec( option.name ) || option.keywords.some( ( keyword ) => query.exec( keyword ) ),
			)
			.slice( 0, maxSuggestions ),
		[ pickerOptions, query ],
	);

	const handleQueryChange = useCallback( ( queryString ) => setQuery( new RegExp( queryString, "gi" ) ), [ setQuery ] );
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

				selection.insertNodes( [ $createTextNode( selectedOption.label ) ] );
				closeMenu();
			} );
		},
		[ editor ],
	);
	const renderMenu = useCallback( ( anchorRef, { options, selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }, queryString ) => {
		if ( anchorRef.current === null || filteredOptions.length === 0 ) {
			return null;
		}

		return anchorRef.current && filteredOptions.length
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
	}, [] );

	return (
		<LexicalTypeaheadMenuPlugin
			onQueryChange={ handleQueryChange }
			onSelectOption={ handleSelectOption }
			triggerFn={ checkForTriggerMatch }
			options={ filteredOptions }
			menuRenderFn={ renderMenu }
		/>
	);
};
