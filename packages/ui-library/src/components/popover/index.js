import classNames from "classnames";
import PropTypes from "prop-types";
import { XIcon } from "@heroicons/react/outline";
import React, { createContext, forwardRef, useCallback, useContext, useEffect, Fragment } from "react";
import { Transition } from "@headlessui/react";
import { noop } from "lodash";
import { useSvgAria } from "../../hooks";

const PopoverContext = createContext( { handleDismiss: noop } );

const positionClassNameMap = {
	"no-arrow": "yst-popover--no-arrow",
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
 * @param {string} screenReaderLabel The screen reader label for the close button.
 * @param {function} [onClick] Function that is called when the user clicks the button. Defaults to the handleDismiss function from the context.
 * @param {string} [className] The additional classname.
 * @param {JSX.node} [children] Possible to override the default screen reader text and X icon.
 * @returns {JSX.Element} The close button.
 */
// eslint-disable-next-line react/display-name
const CloseButton = forwardRef( ( {
	screenReaderLabel,
	onClick,
	className,
	children,
	...props
}, ref ) => {
	const { handleDismiss } = usePopoverContext();
	const svgAriaProps = useSvgAria();
	// const closeButtonRef = useRef( null );

	return (
		<div className="yst-popover__close">
			<button
				type="button"
				ref={ ref }
				onClick={ onClick || handleDismiss }
				className={ classNames( "yst-popover__close-button", className ) }
				{ ...props }
			>
				{ children || <>
					<span className="yst-sr-only">{ screenReaderLabel }</span>
					<XIcon className="yst-h-5 yst-w-5" { ...svgAriaProps } />
				</> }
			</button>
		</div>
	);
} );

CloseButton.propTypes = {
	screenReaderLabel: PropTypes.string,
	onClick: PropTypes.func,
	children: PropTypes.node,
	className: PropTypes.string,
};
CloseButton.defaultProps = {
	screenReaderLabel: "close",
	// eslint-disable-next-line no-undefined
	onClick: undefined,
	className: "",
	// eslint-disable-next-line no-undefined
	children: undefined,
};

/**
 * @param {string} children The popover title.
 * @param {string} [className] The additional class name.
 * @param {string|JSX.Element} [as="h1"] Base component.
 * @param {Object} [props] Additional props.a
 * @returns {JSX.Element} The title.
 */
const Title = ( {
	children,
	className,
	as: Tag = "h1",
	...props
} ) => {
	return ( <Tag
		className={ classNames( "yst-popover__title", className ) }
		{ ...props }
	>
		{ children }
	</Tag> );
};

Title.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	as: PropTypes.elementType,
};

/**
 * @param {string|string[]} children The popover content.
 * @param {string } id The id of the content for accessibility.
 * @param {string|JSX.Element} [as="span"] Base component.
 * @param {string} [className] The additional class name.
 * @returns {JSX.Element} The content.
 */
const Content = ( {
	children,
	id,
	as: Tag = "span",
	className,
} ) => {
	return (
		<Tag id={ id } className={ classNames( "yst-popover__content", className ) }>
			{ children }
		</Tag>
	);
};

Content.propTypes = {
	children: PropTypes.oneOfType( [ PropTypes.node, PropTypes.arrayOf( PropTypes.node ) ] ),
	id: PropTypes.string,
	className: PropTypes.string,
	as: PropTypes.elementType,
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
		<Transition
			as={ Fragment }
			show={ isVisible }
			appear={ true }
			unmount={ true }
			enter={ "yst-transition yst-ease-in-out yst-duration-150" }
			enterFrom="yst-bg-opacity-0"
			enterTo="yst-bg-opacity-75"
			leave="yst-transition yst-duration-50 yst-ease-in"
			leaveFrom="yst-bg-opacity-75"
			leaveTo="yst-bg-opacity-0"
		>
			<div className={ classNames( "yst-popover__backdrop", className ) } />
		</Transition>
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
	as: Component,
	className,
	isVisible,
	setIsVisible,
	position,
	backdrop,
	...props
}, ref ) => {
	const handleDismiss = useCallback( () => {
		setIsVisible( false );
	}, [ setIsVisible ] );

	return (
		<PopoverContext.Provider value={ { handleDismiss } }>
			{ backdrop && <Backdrop isVisible={ isVisible } /> }
			<Transition
				as={ Fragment }
				show={ isVisible }
				appear={ true }
				enter="yst-transition yst-ease-in-out yst-duration-150"
				enterFrom="yst-bg-opacity-0"
				enterTo="yst-bg-opacity-100"
				leave="yst-transition yst-ease-in-out yst-duration-150"
				leaveFrom="yst-opacity-50"
				leaveTo="yst-opacity-0"
				unmount={ true }
			>
				<Component
					ref={ ref }
					id={ id }
					role={ role }
					aria-modal="true"
					aria-labelledby={ children.id }
					aria-describedby={ children.id }
					className={ classNames( "yst-popover", positionClassNameMap[ position ], className ) }
					{ ...props }
				>
					{ children }
				</Component>
			</Transition>
		</PopoverContext.Provider>
	);
} );

Popover.displayName = "Popover";
Popover.propTypes = {
	as: PropTypes.elementType,
	children: PropTypes.node.isRequired,
	id: PropTypes.string.isRequired,
	role: PropTypes.string,
	className: PropTypes.string,
	isVisible: PropTypes.bool,
	setIsVisible: PropTypes.func,
	position: PropTypes.oneOf( Object.keys( positionClassNameMap ) ),
	backdrop: PropTypes.bool,
};

Popover.defaultProps = {
	as: "div",
	role: "dialog",
	isVisible: false,
	setIsVisible: false,
	position: "no-arrow",
	backdrop: false,
	className: "",
};

Popover.Title = Title;
Popover.CloseButton = CloseButton;
Popover.Content = Content;
Popover.Backdrop = Backdrop;

export default Popover;

