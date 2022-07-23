/* eslint-disable jsx-a11y/tabindex-no-positive */
import { XIcon } from "@heroicons/react/solid";
import { useCallback, useState } from "@wordpress/element";
import classNames from "classnames";
import { isString, map, noop } from "lodash";
import PropTypes from "prop-types";

/**
 * @param {string} tag The tag / label.
 * @param {number} index The tag index.
 * @param {boolean} [disabled] Whether the component is disabled.
 * @param {function} onRemoveTag Remove tag handler.
 * @param {string} screenReaderRemoveTag Screen reader text for the remove tag button.
 * @param {Object} [props] Extra properties.
 * @returns {JSX.Element} The element.
 */
const Tag = ( { tag, index, disabled = false, onRemoveTag, screenReaderRemoveTag, ...props } ) => {
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
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div onKeyDown={ handleKeyDown } className="yst-tag-input__tag" { ...props }>
			<span>{ tag }</span>
			<button
				className="yst-tag-input__remove-tag"
				onClick={ handleClick }
			>
				<span className="yst-sr-only">{ screenReaderRemoveTag }</span>
				<XIcon className="yst-h-5 yst-w-5" />
			</button>
		</div>
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
 * @param {string} [screenReaderRemoveTag] Screen reader text for the remove tag button.
 * @param {object} [props] Extra properties.
 * @returns {JSX.Element} The element.
 */
const TagInput = ( {
	tags = [],
	children = null,
	className = "",
	disabled = false,
	onAddTag = noop,
	onRemoveTag = noop,
	screenReaderRemoveTag = "Remove tag",
	...props
} ) => {
	const [ text, setText ] = useState( "" );
	const handleChange = useCallback( event => {
		isString( event?.target?.value ) && setText( event.target.value );
	}, [ setText ] );
	const handleKeyDown = useCallback( event => {
		switch ( event.key ) {
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
				event.preventDefault();
				return true;
		}
	}, [ text, tags, setText, onAddTag ] );

	return (
		<div className={ classNames( "yst-tag-input", disabled && "yst-tag-input--disabled", className ) }>
			{ children || map( tags, ( tag, index ) => (
				<Tag
					key={ `tag-${ index }` }
					tag={ tag }
					index={ index }
					disabled={ disabled }
					tabIndex="2"
					onRemoveTag={ onRemoveTag }
					screenReaderRemoveTag={ screenReaderRemoveTag }
				/>
			) ) }
			<input
				type="text"
				disabled={ disabled }
				className="yst-tag-input__input"
				tabIndex="1"
				onKeyDown={ handleKeyDown }
				onChange={ handleChange }
				value={ text }
				{ ...props }
			/>
		</div>
	);
};

TagInput.propTypes = {
	tags: PropTypes.arrayOf( PropTypes.string ),
	children: PropTypes.node,
	className: PropTypes.string,
	disabled: PropTypes.bool,
	onAddTag: PropTypes.func,
	onRemoveTag: PropTypes.func,
	screenReaderRemoveTag: PropTypes.string,
};

TagInput.Tag = Tag;

export default TagInput;
