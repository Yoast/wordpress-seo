/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalTypeaheadMenuPlugin, MenuOption, useBasicTypeaheadTriggerMatch } from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { $createTextNode, $getSelection, $isRangeSelection } from "lexical";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";

class EmojiOption extends MenuOption {
	constructor( title, emoji, options = {} ) {
		super( title );
		this.title = title;
		this.emoji = emoji;
		this.keywords = options.keywords || [];
	}
}

const EmojiMenuItem = ( { index, isSelected, onClick, onMouseEnter, option } ) => (
	<li
		key={ option.key }
		tabIndex={ -1 }
		className={ `yst-picker-menu-item${ isSelected ? " selected" : "" }` }
		ref={ option.setRefElement }
		role="option"
		aria-selected={ isSelected }
		id={ "typeahead-item-" + index }
		onMouseEnter={ onMouseEnter }
		onClick={ onClick }
	>
		<span className="text">
			{ option.emoji } { option.title }
		</span>
	</li>
);

const MAX_EMOJI_SUGGESTION_COUNT = 10;

export const EmojiPickerPlugin = () => {
	const [ editor ] = useLexicalComposerContext();
	const [ queryString, setQueryString ] = useState( null );
	const [ emojis, setEmojis ] = useState( [] );

	useEffect( () => {
		import( "./list" ).then( ( file ) => setEmojis( file.default ) );
	}, [] );

	const emojiOptions = useMemo(
		() =>
			emojis === null ? [] : emojis.map( ( { emoji, aliases, tags } ) =>
				new EmojiOption( aliases[ 0 ], emoji, {
					keywords: [ ...aliases, ...tags ],
				} ),
			),
		[ emojis ],
	);

	const checkForTriggerMatch = useBasicTypeaheadTriggerMatch( ":", {
		minLength: 0,
	} );

	const options = useMemo( () => {
		return emojiOptions
			.filter( ( option ) => {
				return queryString !== null
					? new RegExp( queryString, "gi" ).exec( option.title ) ||
					option.keywords !== null
						? option.keywords.some( ( keyword ) =>
							new RegExp( queryString, "gi" ).exec( keyword ),
						)
						: false
					: emojiOptions;
			} )
			.slice( 0, MAX_EMOJI_SUGGESTION_COUNT );
	}, [ emojiOptions, queryString ] );

	const onSelectOption = useCallback(
		( selectedOption, nodeToRemove, closeMenu ) => {
			editor.update( () => {
				const selection = $getSelection();

				if ( ! $isRangeSelection( selection ) || selectedOption == null ) {
					return;
				}

				if ( nodeToRemove ) {
					nodeToRemove.remove();
				}

				selection.insertNodes( [ $createTextNode( selectedOption.emoji ) ] );

				closeMenu();
			} );
		},
		[ editor ],
	);

	return (
		<LexicalTypeaheadMenuPlugin
			onQueryChange={ setQueryString }
			onSelectOption={ onSelectOption }
			triggerFn={ checkForTriggerMatch }
			options={ options }
			menuRenderFn={ (
				anchorElementRef,
				{ selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
			) => {
				if ( anchorElementRef.current == null || options.length === 0 ) {
					return null;
				}

				return anchorElementRef.current && options.length
					? ReactDOM.createPortal(
						<ul className="yst-picker-menu typeahead-popover yst-emoji-menu">
							{ options.map( ( option, index ) => (
								<div key={ option.key }>
									<EmojiMenuItem
										index={ index }
										isSelected={ selectedIndex === index }
										onClick={ () => {
											setHighlightedIndex( index );
											selectOptionAndCleanUp( option );
										} }
										onMouseEnter={ () => {
											setHighlightedIndex( index );
										} }
										option={ option }
									/>
								</div>
							) ) }
						</ul>,
						anchorElementRef.current,
					)
					: null;
			} }
		/>
	);
};
