import classNames from "classnames";
import PropTypes from "prop-types";
import { XIcon } from "@heroicons/react/outline";
import React, { createContext, forwardRef, useCallback, useContext } from "react";
import { isArray, noop } from "lodash";

const PopoverContext = createContext( { handleDismiss: noop } );

/**
 * @returns {Object} The popover context.
 */
export const usePopoverContext = () => useContext( PopoverContext );

const positionClassNameMap = {
	top: "yst-popover--top",
	right: "yst-popover--right",
	bottom: "yst-popover--bottom",
	left: "yst-popover--left",
};

/**
 * @param {string} dismissScreenReaderLabel The screen reader label for the dismiss button.
 * @param {string} [className] The additional class name.
 * @returns {JSX.Element} The close button.
 */
const CloseButton = ( {
	dismissScreenReaderLabel,
} ) => {
	const { popoverRef } = usePopoverContext();

	const handleDismiss = () => {
		if ( popoverRef?.current ) {
			popoverRef.current.hidePopover();
		}
	};

	return (
		<div className="yst-flex-shrink-0 yst-flex yst-self-start">
			<button
				type="button"
				/* eslint-disable-next-line react/jsx-no-bind */
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
 * @param {string} [className] The additional class name.
 * @returns {JSX.Element} The content.
 */
const Content = ( {
	content,
	className = "",
} ) => {
	return isArray( content ) ? (
		<ul className={ classNames( "yst-list-disc yst-ms-4", className ) }>
			{ content.map( ( text, index ) => (
				<li className="yst-pt-1" key={ `${ text }-${ index }` }>{ text }</li>
			) ) }
		</ul>
	) : (
		<p className={ classNames( "yst-overflow-hidden", className ) }>{ content }</p>
	);
};

Content.propTypes = {
	content: PropTypes.oneOfType( [ PropTypes.node, PropTypes.arrayOf( PropTypes.node ) ] ),
	className: PropTypes.string,
};

/**
 * @param {string} title The popover title.
 * @param {string} [className] The additional class name.
 * @returns {JSX.Element} The title.
 */
const Title = ( {
	title,
	className = "",
} ) => {
	return <h1 className={ classNames( "yst-text-sm yst-font-medium yst-text-slate-800", className ) }>
		{ title }
	</h1>;
};

Title.propTypes = {
	title: PropTypes.string.isRequired,
	className: PropTypes.string,
};

/**
 * @param {JSX.node} children Children of the popover.
 * @param {string} id The popover id.
 * @param {string|JSX.Element} [as] Base component.
 * @param {string} [className] Additional CSS classes.
 * @param {string} [position] The position of the popover.
 * @param {string} [variant] Variant of the popover.
 * @param {Function} [onDismiss] Function to dismiss the popover.
 * @param {boolean} isVisible Whether the popover is visible.
 * @param {Function} setIsVisible Function to set the visibility of the element.
 * @returns {JSX.Element} The popover component.
 */

const Popover = forwardRef( ( {
	children,
	id,
	as: Component,
	className,
	onDismiss = noop,
	isVisible,
	setIsVisible,
	isOpen,
	position,
	...props
}, ref ) => {
	// Prevent rendering if not open
	if ( ! isOpen ) {
		return null;
	}

	const handleDismiss = useCallback( () => {
		setIsVisible( false );
	}, [ onDismiss, id ] );

	return (
		<PopoverContext.Provider value={ { handleDismiss, popoverRef: ref } }>
			<div className="yst-popover-backdrop" />
			<Component
				ref={ ref }
				id="popover"
				role="dialog"
				isVisible={ isVisible }
				aria-modal={ isOpen ? "true" : "false" }
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
	children: PropTypes.node,
	id: PropTypes.string,
	className: PropTypes.string,
	isOpen: PropTypes.bool,
	isVisible: PropTypes.bool.isRequired,
	setIsVisible: PropTypes.func.isRequired,
	// eslint-disable-next-line react/require-default-props
	onDismiss: PropTypes.func,
	position: PropTypes.oneOf( Object.keys( positionClassNameMap ) ),

};

Popover.defaultProps = {
	as: "div",
	id: "",
	isOpen: true,
	children: "",
	className: "",
	position: "left",
};

export default Popover;

Popover.Title = Title;
Popover.CloseButton = CloseButton;
Popover.Content = Content;
