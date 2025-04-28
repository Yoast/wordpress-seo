import classNames from "classnames";
import PropTypes from "prop-types";
import { XIcon } from "@heroicons/react/outline";
import React, { createContext, forwardRef, useCallback, useContext, useEffect, useRef } from "react";
import { noop } from "lodash";

const PopoverContext = createContext( { handleDismiss: noop  } );

const positionClassNameMap = {
	"no-arrow": "yst-popover",
	top: "yst-popover--top",
	"top-left": "yst-popover--top-left",
	"top-right": "yst-popover--top-right",
	right: "yst-popover--right",
	bottom: "yst-popover--bottom",
	left: "yst-popover--left",
	"bottom-left": "yst-popover--bottom-left",
	"bottom-right": "yst-popover--bottom-right",
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
	const closeButtonRef = useRef( null );

	return (
		<div className="yst-close-button-wrapper">
			<button
				type="button"
				ref={ closeButtonRef }
				onClick={ handleDismiss }
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
 * @param {string} title The popover title.
 * @param {string} id The id of the title.
 * @param {string} [className] The additional class name.
 * @returns {JSX.Element} The title.
 */
const Title = ( {
	title,
	id,
	className,
} ) => {
	return <h1 id={ id } className={ classNames( "yst-popover-title", className ) }>
		{ title }
	</h1>;
};

Title.propTypes = {
	title: PropTypes.string.isRequired,
	id: PropTypes.string,
	className: PropTypes.string,
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
	className,
} ) => {
	return (
		<p id={ id } className={ classNames( "yst-overflow-wrap", className ) }>
			{ content }
		</p>
	);
};

Content.propTypes = {
	content: PropTypes.oneOfType( [ PropTypes.node, PropTypes.arrayOf( PropTypes.node ) ] ),
	id: PropTypes.string,
	className: PropTypes.string,
};

/**
 * @param {string} [className] The additional class name.
 * @param {boolean} isVisible Whether the backdrop is visible.
 * @returns {JSX.Element} The backdrop.
 */
const Backdrop = ( {
	className, isVisible,
} ) => {
	useEffect( () => {
		if ( isVisible ) {
			document.body.classList.add( "backdrop-active" );
		} else {
			document.body.classList.remove( "backdrop-active" );
		}
	}, [ isVisible ] );
	return (
		<div className={ classNames( "yst-popover-backdrop", className ) } />
	);
};

Backdrop.propTypes = {
	className: PropTypes.string,
	isVisible: PropTypes.bool.isRequired,
};

/**
 * @param {JSX.node} children Children of the popover.
 * @param {string} id The popover id.
 * @param {string} role The role of the popover.
 * @param {string|JSX.Element} [as] Base component.
 * @param {string} [className] Additional CSS classes.
 * @param {string} [position] The position of the popover.
 * @param {boolean} isVisible Whether the popover is visible.
 * @param {Function} setIsVisible Function to set the visibility of the element.
 * @param { JSX.Element } backdrop The backdrop of the popover.
 * @returns {JSX.Element} The popover component.
 */

const Popover = forwardRef( ( {
	children,
	id,
	role,
	as: Component = "div",
	className = "",
	isVisible,
	setIsVisible,
	position = "no-arrow",
	backdrop = false,
	...props
}, ref ) => {
	const handleDismiss = useCallback( () => {
		setIsVisible( false );
	}, [ setIsVisible ] );

	// Prevent rendering if not visible
	if ( ! isVisible ) {
		return null;
	}

	return (
		<PopoverContext.Provider value={ { handleDismiss } }>
			{ backdrop && <Backdrop isVisible={ true } /> }
			<Component
				ref={ ref }
				id={ id }
				role={ role || "dialog" }
				aria-modal="true"
				aria-labelledby={ children.id }
				aria-describedby={ children.id }
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
	as: PropTypes.elementType.isRequired,
	children: PropTypes.node.isRequired,
	id: PropTypes.string.isRequired,
	role: PropTypes.string.isRequired,
	className: PropTypes.string.isRequired,
	isVisible: PropTypes.bool.isRequired,
	setIsVisible: PropTypes.func.isRequired,
	position: PropTypes.oneOf( Object.keys( positionClassNameMap ) ).isRequired,
	backdrop: PropTypes.bool.isRequired,
};

Popover.Title = Title;
Popover.CloseButton = CloseButton;
Popover.Content = Content;
Popover.Backdrop = Backdrop;

export default Popover;

