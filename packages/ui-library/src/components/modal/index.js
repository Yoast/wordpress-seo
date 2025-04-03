import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef, Fragment } from "react";
import { classNameMap as titleClassNameMap } from "../../elements/title";
import { useSvgAria } from "../../hooks";
import { Container } from "./container";
import { ModalContext, useModalContext } from "./hooks";

/**
 * @param {JSX.node} children Title text.
 * @param {string} [className] Additional class names.
 * @param {string|JSX.Element} [as="h1"] Base component.
 * @param {string} [size] Size of title.
 * @param {Object} [props] Additional props.
 * @returns {JSX.Element} The title.
 */
const Title = forwardRef( ( { children, size, className, as, ...props }, ref ) => {
	return (
		<Dialog.Title
			as={ as }
			ref={ ref }
			className={ classNames(
				"yst-title",
				size ? titleClassNameMap.size[ size ] : "",
				className ) }
			{ ...props }
		>
			{ children }
		</Dialog.Title>
	);
} );

Title.displayName = "Modal.Title";
Title.propTypes = {
	size: PropTypes.oneOf( Object.keys( titleClassNameMap.size ) ),
	className: PropTypes.string,
	children: PropTypes.node.isRequired,
	as: PropTypes.elementType,
};
Title.defaultProps = {
	// eslint-disable-next-line no-undefined
	size: undefined,
	className: "",
	as: "h1",
};

/**
 * @param {string} [className] Additional classname for the button.
 * @param {function} [onClick] Function that is called when the user clicks the button. Defaults to the onClose function from the context.
 * @param {string} [screenReaderText] The screen reader text. Used when no children are provided.
 * @param {JSX.node} [children] Possible to override the default screen reader text and X icon.
 * @returns {JSX.Element} The close button.
 */
const CloseButton = forwardRef( ( { className, onClick, screenReaderText, children, ...props }, ref ) => {
	const { onClose } = useModalContext();
	const svgAriaProps = useSvgAria();

	return (
		<div className="yst-modal__close">
			<button
				ref={ ref }
				type="button"
				onClick={ onClick || onClose }
				className={ classNames( "yst-modal__close-button", className ) }
				{ ...props }
			>
				{ children || <>
					<span className="yst-sr-only">{ screenReaderText }</span>
					<XIcon className="yst-h-6 yst-w-6" { ...svgAriaProps } />
				</> }
			</button>
		</div>
	);
} );

CloseButton.displayName = "Modal.CloseButton";
CloseButton.propTypes = {
	className: PropTypes.string,
	onClick: PropTypes.func,
	screenReaderText: PropTypes.string,
	children: PropTypes.node,
};
CloseButton.defaultProps = {
	className: "",
	// eslint-disable-next-line no-undefined
	onClick: undefined,
	screenReaderText: "Close",
	// eslint-disable-next-line no-undefined
	children: undefined,
};

/**
 * @param {JSX.node} children Contents of the modal.
 * @param {string} [className] Additional class names.
 * @param {boolean} [hasCloseButton] Whether the modal has a close button.
 * @param {string} [closeButtonScreenReaderText] The screen reader text of the close button. Used when hasCloseButton is true.
 * @param {Object} [props] Additional props.
 * @returns {JSX.Element} The panel.
 */
const Panel = forwardRef( ( { children, className = "", hasCloseButton = true, closeButtonScreenReaderText = "Close", ...props }, ref ) => {
	return (
		<Dialog.Panel
			ref={ ref }
			className={ classNames( "yst-modal__panel", className ) }
			{ ...props }
		>
			{ hasCloseButton && <CloseButton screenReaderText={ closeButtonScreenReaderText } /> }
			{ children }
		</Dialog.Panel>
	);
} );

Panel.displayName = "Modal.Panel";
Panel.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	hasCloseButton: PropTypes.bool,
	closeButtonScreenReaderText: PropTypes.string,
};
Panel.defaultProps = {
	className: "",
	hasCloseButton: true,
	closeButtonScreenReaderText: "Close",
};

export const classNameMap = {
	position: {
		center: "yst-modal--center",
		"top-center": "yst-modal--top-center",
	},
};

/**
 * @param {boolean} isOpen Whether the modal is open.
 * @param {function} onClose Function that is called when the user wants to close the modal.
 * @param {JSX.node} children Contents of the modal.
 * @param {string} [className] Additional class names.
 * @param {string} [position] Modal screen position. See `classNameMap.position` for the options.
 * @param {function|Object|null} [initialFocus] The ref of the element to focus initially.
 * @param {Object} [props] Additional Dialog props.
 * @returns {JSX.Element} The modal.
 */
const Modal = forwardRef( ( {
	isOpen,
	onClose,
	children,
	className = "",
	position = "center",
	initialFocus = null,
	...props
}, ref ) => (
	<ModalContext.Provider value={ { isOpen, onClose, initialFocus } }>
		<Transition.Root show={ isOpen } as={ Fragment }>
			{ /* Using the `yst-root` class here to get our styling within the portal. */ }
			<Dialog
				as="div"
				ref={ ref }
				className="yst-root"
				open={ isOpen }
				onClose={ onClose }
				initialFocus={ initialFocus }
				{ ...props }
			>
				<div className={ classNames( "yst-modal", classNameMap.position[ position ], className ) }>
					<Transition.Child
						as={ Fragment }
						enter="yst-ease-out yst-duration-300"
						enterFrom="yst-opacity-0"
						enterTo="yst-opacity-100"
						leave="yst-ease-in yst-duration-200"
						leaveFrom="yst-opacity-100"
						leaveTo="yst-opacity-0"
					>
						<div className="yst-modal__overlay" />
					</Transition.Child>
					<div className="yst-modal__layout">
						<Transition.Child
							as={ Fragment }
							enter="yst-ease-out yst-duration-300"
							enterFrom="yst-opacity-0 yst-translate-y-4 sm:yst-translate-y-0 sm:yst-scale-95"
							enterTo="yst-opacity-100 yst-translate-y-0 sm:yst-scale-100"
							leave="yst-ease-in yst-duration-200"
							leaveFrom="yst-opacity-100 yst-translate-y-0 sm:yst-scale-100"
							leaveTo="yst-opacity-0 yst-translate-y-4 sm:yst-translate-y-0 sm:yst-scale-95"
						>
							{ children }
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	</ModalContext.Provider>
) );

Modal.displayName = "Modal";
Modal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	position: PropTypes.oneOf( Object.keys( classNameMap.position ) ),
	initialFocus: PropTypes.oneOfType( [ PropTypes.func, PropTypes.object ] ),
};
Modal.defaultProps = {
	className: "",
	position: "center",
	initialFocus: null,
};

Modal.Panel = Panel;
Modal.Title = Title;
Modal.CloseButton = CloseButton;
Modal.Description = Dialog.Description;
Modal.Description.displayName = "Modal.Description";
Modal.Container = Container;

export default Modal;
