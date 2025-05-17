import { XIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { isString, map, noop } from "lodash";
import PropTypes from "prop-types";
import React, { forwardRef, useCallback, useState } from "react";
import { Badge } from "../../index";

/**
 * @param {string} tag The tag / label.
 * @param {number} index The tag index.
 * @param {boolean} [disabled] Whether the component is disabled.
 * @param {function} onRemoveTag Remove tag handler.
 * @param {string} screenReaderRemoveTag Screen reader text for the remove tag button.
 * @param {Object} [props] Extra properties.
 * @returns {JSX.Element} The element.
 */
export const Tag = ( { tag, index, disabled = false, onRemoveTag, screenReaderRemoveTag, ...props } ) => {
	const handleKeyDown = useCallback( event => {
		if ( disabled ) {
			return;
		}
		switch ( event?.key ) {
			case "Delete":
			case "Backspace":
				onRemoveTag( index );
				event.preventDefault();
				return true;
		}
	}, [ index, disabled, onRemoveTag ] );
	const handleClick = useCallback( event => {
		if ( disabled ) {
			return;
		}
		onRemoveTag( index );
		event.preventDefault();
		return true;
	}, [ index, disabled, onRemoveTag ] );

	return (
		<Badge
			onKeyDown={ handleKeyDown } { ...props } variant="plain" className="yst-tag-input__tag"
		>
			<span className="yst-mb-px">{ tag }</span>
			<button type="button" onClick={ handleClick } className="yst-tag-input__remove-tag">
				<span className="yst-sr-only">{ screenReaderRemoveTag }</span>
				<XIcon className="yst-h-3 yst-w-3" />
			</button>
		</Badge>
	);
};

Tag.propTypes = {
	tag: PropTypes.string.isRequired,
	index: PropTypes.number.isRequired,
	disabled: PropTypes.bool,
	onRemoveTag: PropTypes.func.isRequired,
	screenReaderRemoveTag: PropTypes.string.isRequired,
};

/**
 * @param {string[]} [tags] The tags.
 * @param {JSX.node} [children] Render tags override.
 * @param {string} [className] Extra CSS class.
 * @param {boolean} [disabled] Whether the input is disabled.
 * @param {function} [onAddTag] Add tag handler.
 * @param {function} [onRemoveTag] Remove tag handler.
 * @param {function} [onSetTags] Set tag handler.
 * @param {function} [onBlur] Blur handler.
 * @param {string} [screenReaderRemoveTag] Screen reader text for the remove tag button.
 * @param {object} [props] Extra properties.
 * @returns {JSX.Element} The element.
 */
const TagInput = forwardRef( ( {
	tags = [],
	children,
	className,
	disabled,
	onAddTag,
	onRemoveTag,
	onSetTags,
	onBlur,
	screenReaderRemoveTag,
	...props
}, ref ) => {
	const [ text, setText ] = useState( "" );
	const handleChange = useCallback( event => {
		isString( event?.target?.value ) && setText( event.target.value );
	}, [ setText ] );
	const handleKeyDown = useCallback( event => {
		switch ( event.key ) {
			case ",":
			case "Enter":
				// Do not add empty tags.
				if ( text.length > 0 ) {
					onAddTag( text );
					setText( "" );
				}
				event.preventDefault();
				return true;
			case "Backspace":
				// Only when there is text and a tag available.
				if ( text.length !== 0 || tags.length === 0 ) {
					break;
				}
				onRemoveTag( tags.length - 1 );
				if ( event.ctrlKey ) {
					onSetTags( [] );
				}

				event.preventDefault();
				return true;
		}
	}, [ text, tags, setText, onAddTag ] );
	const handleBlur = useCallback( event => {
		if ( text.length > 0 ) {
			onAddTag( text );
			setText( "" );
		}
		onBlur( event );
	}, [ text, onAddTag, setText, onBlur ] );

	return (
		<div className={ classNames( "yst-tag-input", disabled && "yst-tag-input--disabled", className ) }>
			{ children || map( tags, ( tag, index ) => (
				<Tag
					key={ `tag-${ index }` }
					tag={ tag }
					index={ index }
					disabled={ disabled }
					onRemoveTag={ onRemoveTag }
					screenReaderRemoveTag={ screenReaderRemoveTag }
				/>
			) ) }
			<input
				ref={ ref }
				type="text"
				disabled={ disabled }
				className="yst-tag-input__input"
				onKeyDown={ handleKeyDown }
				{ ...props }
				onChange={ handleChange }
				onBlur={ handleBlur }
				value={ text }
			/>
		</div>
	);
} );

TagInput.displayName = "TagInput";
TagInput.propTypes = {
	tags: PropTypes.arrayOf( PropTypes.string ),
	children: PropTypes.node,
	className: PropTypes.string,
	disabled: PropTypes.bool,
	onAddTag: PropTypes.func,
	onRemoveTag: PropTypes.func,
	onSetTags: PropTypes.func,
	onBlur: PropTypes.func,
	screenReaderRemoveTag: PropTypes.string,
};
TagInput.defaultProps = {
	tags: [],
	children: null,
	className: "",
	disabled: false,
	onAddTag: noop,
	onRemoveTag: noop,
	onSetTags: noop,
	onBlur: noop,
	screenReaderRemoveTag: "Remove tag",
};

TagInput.Tag = Tag;
TagInput.Tag.displayName = "TagInput.Tag";

export default TagInput;
