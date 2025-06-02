import classNames from "classnames";
import PropTypes from "prop-types";
import { XIcon } from "@heroicons/react/outline";
import React, { createContext, forwardRef, useCallback, useContext, Fragment } from "react";
import { Transition } from "@headlessui/react";
import { noop } from "lodash";
import { useSvgAria } from "../../hooks";
import Title from "../../elements/title";

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
 * @param {string} [className=""] The additional class name.
 * @param {React.ReactNode} [children=null] Possible to override the default screen reader text and X icon.
 * @param {Object} [props] Additional props.
 * @returns {JSX.Element} The close button.
 */
const CloseButton = forwardRef( ( {
	screenReaderLabel = "Close",
	onClick = null,
	className	 = "",
	children = null,
	...props
}, ref ) => {
	const { handleDismiss } = usePopoverContext();
	const svgAriaProps = useSvgAria();

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

CloseButton.displayName = "Popover.CloseButton";
CloseButton.propTypes = {
	screenReaderLabel: PropTypes.string,
	onClick: PropTypes.func,
	children: PropTypes.node,
	className: PropTypes.string,
};

/**
 * @param {string} [className] The additional class name.
 * @param {React.ReactNode} [children=null]
 * @param {Object} [props] Additional props.
 * @returns {JSX.Element} The title.
 */
const PopoverTitle = ( {
	className = "",
	children = null,
	...props
} ) => {
	return ( <Title
		className={ classNames( "yst-popover__title", className ) }
		size={ 5 }
		{ ...props }
	>
		{ children }
	</Title> );
};

PopoverTitle.displayName = "Popover.Title";
PopoverTitle.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
};

/**
 * @param {React.ReactNode} [children=null] The content.
 * @param {string} [className=""] The additional class name.
 * @param {string|JSX.Element} [as="p"] The base component to render the content as.
 * @param {Object} [props] Additional props.
 * @returns {JSX.Element} [as=""] The element.
 */
const Content = ( {
	children = null,
	as: Tag = "p",
	className = "",
	...props
} ) => {
	return (
		<Tag
			className={ classNames( "yst-popover__content", className ) }
			{ ...props }
		>
			{ children }
		</Tag>
	);
};

Content.displayName = "Popover.Content";
Content.propTypes = {
	className: PropTypes.string,
	as: PropTypes.elementType,
	children: PropTypes.oneOfType( [ PropTypes.node, PropTypes.arrayOf( PropTypes.node ) ] ),
};

/**
 * @param {string} [className=""] The additional class name.
 * @param {boolean} isVisible Whether the backdrop is visible.
 * @param {Object} [props] Additional props.
 * @returns {JSX.Element} The backdrop.
 */
const Backdrop = ( {
	className = "", isVisible,
	...props
} ) => {
	return (
		<Transition
			as="div"
			show={ isVisible }
			appear={ true }
			unmount={ true }
			enter={ classNames( "yst-popover__backdrop yst-transition yst-duration-150 yst-ease-in", className ) }
			enterFrom="yst-bg-opacity-0"
			enterTo="yst-bg-opacity-75"
			entered={ classNames( "yst-popover__backdrop", className ) }
			leave={ classNames( "yst-popover__backdrop yst-transition yst-duration-150 yst-ease-in", className ) }
			leaveFrom="yst-bg-opacity-75"
			leaveTo="yst-bg-opacity-0"
			{ ...props }
		/>
	);
};

Backdrop.displayName = "Popover.Backdrop";
Backdrop.propTypes = {
	className: PropTypes.string,
	isVisible: PropTypes.bool.isRequired,
};

/**
 * @param {React.ReactNode} children The Children of the popover.
 * @param {string} [role] The role of the popover.
 * @param {string|JSX.Element} [as] Base component.
 * @param {string} [className=""] The additional class name.
 * @param {string} [position] The position of the popover.
 * @param {boolean} [isVisible] Whether the popover is visible.
 * @param {Function} [setIsVisible] Function to set the visibility of the element.
 * @param { JSX.Element } [hasBackdrop] Whether the popover has a backdrop.
 * @param {Object} [props] Additional props.
 * @returns {JSX.Element} The popover component.
 */

const Popover = forwardRef( ( {
	children,
	role = "dialog",
	as: Component = "div",
	className = "",
	isVisible = false,
	setIsVisible = noop,
	position = "no-arrow",
	hasBackdrop = false,
	...props
}, ref ) => {
	const handleDismiss = useCallback( () => {
		setIsVisible( false );
	}, [ setIsVisible ] );

	return (
		<PopoverContext.Provider value={ { handleDismiss } }>
			{ hasBackdrop && <Backdrop isVisible={ isVisible } /> }
			<Transition
				as={ Fragment }
				show={ isVisible }
				appear={ true }
				enter="yst-transition yst-ease-in-out yst-duration-50"
				enterFrom="yst-bg-opacity-0"
				enterTo="yst-bg-opacity-100"
				leave="yst-transition yst-ease-in-out yst-duration-50"
				leaveFrom="yst-opacity-100"
				leaveTo="yst-opacity-0"
				unmount={ true }
			>
				<Component
					ref={ ref }
					role={ role }
					aria-modal="true"
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
	role: PropTypes.string,
	className: PropTypes.string,
	isVisible: PropTypes.bool,
	setIsVisible: PropTypes.func,
	position: PropTypes.oneOf( Object.keys( positionClassNameMap ) ),
	hasBackdrop: PropTypes.bool,
};

Popover.Title = PopoverTitle;
Popover.CloseButton = CloseButton;
Popover.Content = Content;
Popover.Backdrop = Backdrop;

export default Popover;

