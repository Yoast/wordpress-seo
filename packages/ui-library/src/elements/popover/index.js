import classNames from "classnames";
import PropTypes from "prop-types";
import { XIcon } from "@heroicons/react/outline";
import React, { createContext, forwardRef, useCallback, useContext } from "react";
import { isArray, noop } from "lodash";

const PopoverContext = createContext( { handleDismiss: noop  } );

const positionClassNameMap = {
	top: "yst-popover--top",
	topLeft: "yst-popover--top-left",
	topRight: "yst-popover--top-right",
	right: "yst-popover--right",
	bottom: "yst-popover--bottom",
	left: "yst-popover--left",
	bottomLeft: "yst-popover--bottom-left",
	bottomRight: "yst-popover--bottom-right",
};

/**
 * @returns {Object} The popover context.
 */
export const usePopoverContext = () => useContext( PopoverContext );

/**
 * @param {string} dismissScreenReaderLabel The screen reader label for the dismiss button.
 * @param {string} [className] The additional class name.
 * @returns {JSX.Element} The close button.
 */
const CloseButton = ( {
	dismissScreenReaderLabel,
} ) => {
	const { handleDismiss } = usePopoverContext();

	return (
		<div className="yst-flex-shrink-0 yst-flex yst-self-start">
			<button
				type="button"
				onClick={ handleDismiss }
				className="yst-bg-transparent yst-rounded-md yst-inline-flex yst-text-slate-400 hover:yst-text-slate-500 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-primary-500"
			>
				<span className="yst-sr-only">{ dismissScreenReaderLabel }</span>
				<XIcon className="yst-h-5 yst-w-5" />
			</button>
		</div>
	);
};

CloseButton.propTypes = {
	dismissScreenReaderLabel: PropTypes.string.isRequired,
};

/**
 * @param {string|string[]} content The popover content.
 * @param {string } id The id of the content for accessibility.
 * @param {string} [className] The additional class name.
 * @returns {JSX.Element} The content.
 */
const Content = ( {
	content,
	id,
	className = "",
} ) => {
	return isArray( content ) ? (
		<ul id={ id } className={ classNames( "yst-list-disc yst-ms-4", className ) }>
			{ content.map( ( text, index ) => (
				<li className="yst-pt-1" key={ `${ text }-${ index }` }>{ text }</li>
			) ) }
		</ul>
	) : (
		<p id={ id } className={ classNames( "yst-overflow-wrap", className ) }>{ content }</p>
	);
};

Content.propTypes = {
	content: PropTypes.oneOfType( [ PropTypes.node, PropTypes.arrayOf( PropTypes.node ) ] ),
	id: PropTypes.string,
	className: PropTypes.string,
};

/**
 * @param {string} title The popover title.
 * @param {string} id The id of the title.
 * @param {string} [className] The additional class name.
 * @returns {JSX.Element} The title.
 */
const Title = ( {
	title,
	id,
	className = "",
} ) => {
	return <h1 id={ id } className={ classNames( "yst-text-sm yst-font-medium yst-text-slate-800", className ) }>
		{ title }
	</h1>;
};

Title.propTypes = {
	title: PropTypes.string.isRequired,
	id: PropTypes.string,
	className: PropTypes.string,
};

/**
 * @param {JSX.node} children Children of the popover.
 * @param {string} id The popover id.
 * @param {string|JSX.Element} [as] Base component.
 * @param {string} [className] Additional CSS classes.
 * @param {string} [position] The position of the popover.
 * @param {boolean} isVisible Whether the popover is visible.
 * @param {Function} setIsVisible Function to set the visibility of the element.
 * @returns {JSX.Element} The popover component.
 */

const Popover = forwardRef(  ( {
	children,
	id,
	as: Component,
	className = "",
	isVisible,
	setIsVisible,
	position,
	...props
}, ref ) => {
	// Prevent rendering if not visible
	if ( ! isVisible ) {
		return null;
	}

	const handleDismiss = useCallback( () => {
		setIsVisible?.( false );
	}, [ setIsVisible ] );

	return (
		<PopoverContext.Provider value={ { handleDismiss } }>
			{ isVisible && <div className="yst-popover-backdrop" /> }
			<Component
				ref={ ref }
				id={ id }
				role="dialog"
				aria-modal={ "true" }
				aria-labelledby="popover-title"
				aria-describedby="popover-content"
				className={ classNames( "yst-popover", positionClassNameMap[ position ], className ) }
				{ ...props }
			>
				{ children }
			</Component>
		</PopoverContext.Provider>
	);
} );

Popover.displayName = "Popover";

Popover.propTypes = {
	as: PropTypes.elementType,
	children: PropTypes.node.isRequired,
	id: PropTypes.string,
	className: PropTypes.string,
	isVisible: PropTypes.bool.isRequired,
	setIsVisible: PropTypes.func.isRequired,
	position: PropTypes.oneOf( Object.keys( positionClassNameMap ) ),
};

Popover.defaultProps = {
	as: "div",
	id: "yst-popover",
	className: "",
	position: "",
};

Popover.Title = Title;
Popover.CloseButton = CloseButton;
Popover.Content = Content;

export default Popover;

