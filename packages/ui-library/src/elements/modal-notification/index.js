import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { isArray, noop } from "lodash";
import PropTypes from "prop-types";
import React, { createContext, forwardRef, Fragment, useContext } from "react";

const ModalNotificationContext = createContext( { handleDismiss: noop } );

/**
 * @returns {Object} The modal notification context.
 */
export const useModalNotificationContext = () => useContext( ModalNotificationContext );

export const modalNotificationClassNameMap = {
	position: {
		"bottom-center": "yst-translate-y-full",
		"bottom-left": "yst-translate-y-full",
		"bottom-right": "yst-translate-y-full",
		"top-center": "yst--translate-y-full",
		"top-right": "yst--translate-y-full",
	},
};

const positionClassNameMap = {
	"bottom-center": "yst-fixed yst-inset-x-0 yst-bottom-0 yst-flex yst-justify-center yst-p-4 yst-z-50",
	"bottom-left": "yst-fixed yst-bottom-0 yst-left-0 yst-p-4 yst-z-50",
	"bottom-right": "yst-fixed yst-bottom-0 yst-right-0 yst-p-4 yst-z-50",
	"top-center": "yst-fixed yst-inset-x-0 yst-top-0 yst-flex yst-justify-center yst-p-4 yst-z-50",
	"top-right": "yst-fixed yst-top-0 yst-right-0 yst-p-4 yst-z-50",
};

/**
 * @param {string} dismissScreenReaderLabel The screen reader label for the dismiss button.
 * @returns {JSX.Element} The close button.
 */
const Close = ( {
	dismissScreenReaderLabel,
} ) => {
	const { handleDismiss } = useModalNotificationContext();
	return (
		<div className="yst-flex-shrink-0 yst-flex yst-self-start">
			<button
				type="button"
				onClick={ handleDismiss }
				aria-label={ dismissScreenReaderLabel }
				className="yst-bg-transparent yst-rounded-md yst-inline-flex yst-text-slate-400 hover:yst-text-slate-500 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-primary-500"
			>
				<XIcon className="yst-h-5 yst-w-5" aria-hidden="true" />
			</button>
		</div>
	);
};

Close.propTypes = {
	dismissScreenReaderLabel: PropTypes.string.isRequired,
};

/**
 * @param {React.ReactNode} [message=null] The message.
 * @param {string} [className] The additional class name.
 * @returns {JSX.Element} The message.
 */
const Message = ( {
	message = null,
	className = "",
} ) => {
	return isArray( message ) ? (
		<Dialog.Description as="ul" className={ classNames( "yst-list-disc yst-ms-4", className ) }>
			{ message.map( ( text, index ) => (
				<li className="yst-pt-1" key={ `${ text }-${ index }` }>{ text }</li>
			) ) }
		</Dialog.Description>
	) : (
		<Dialog.Description as="p" className={ className }>{ message }</Dialog.Description>
	);
};

Message.propTypes = {
	message: PropTypes.oneOfType( [ PropTypes.node, PropTypes.arrayOf( PropTypes.node ) ] ),
	className: PropTypes.string,
};

/**
 * @param {string} title The title.
 * @param {string} [className] The additional class name.
 * @returns {JSX.Element} The title.
 */
const Title = ( {
	title,
	className = "",
} ) => {
	return <Dialog.Title as="p" className={ classNames( "yst-text-sm yst-font-medium yst-text-slate-800", className ) }>
		{ title }
	</Dialog.Title>;
};

Title.propTypes = {
	title: PropTypes.string.isRequired,
	className: PropTypes.string,
};

/**
 * @param {React.ReactNode} children The panel content.
 * @param {string} [className] The additional class name.
 * @param {Object} ref The forwarded ref.
 * @returns {JSX.Element} The panel.
 */
const Panel = forwardRef( ( {
	children,
	className = "",
}, ref ) => {
	return (
		/* The yst-toast class is defined in elements/toast/style.css. */
		<Dialog.Panel ref={ ref } className={ classNames( "yst-toast", className ) }>
			{ children }
		</Dialog.Panel>
	);
} );

Panel.displayName = "ModalNotification.Panel";
Panel.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

/**
 * @param {Object} props The props object.
 * @param {React.ReactNode} [children=null] The children.
 * @param {string} [className] The additional class name.
 * @param {string} [position="bottom-left"] The position.
 * @param {boolean} isOpen Whether the modal notification is open.
 * @param {Function} onClose Function to call when the modal notification should close.
 * @param {function|Object|null} [initialFocus] The ref of the element to focus initially.
 * @param {Object} [rest] Additional props are forwarded to HeadlessUI's Dialog (e.g. role, aria-label).
 * @returns {JSX.Element} The modal notification component.
 */
const ModalNotification = ( {
	children = null,
	className = "",
	position = "bottom-left",
	isOpen,
	onClose,
	initialFocus = null,
	...restProps
} ) => {
	return (
		<ModalNotificationContext.Provider value={ { handleDismiss: onClose } }>
			<Transition.Root show={ isOpen } as={ Fragment }>
				{ /* Using the `yst-root` class here to get our styling within the portal. */ }
				<Dialog
					as="div"
					className="yst-root"
					onClose={ onClose }
					initialFocus={ initialFocus }
					{ ...restProps }
				>
					<div className={ classNames( positionClassNameMap[ position ], className ) }>
						<Transition.Child
							as={ Fragment }
							enter="yst-transition yst-ease-in-out yst-duration-150"
							enterFrom={ classNames( "yst-opacity-0", modalNotificationClassNameMap.position[ position ] ) }
							enterTo="yst-translate-y-0"
							leave="yst-transition yst-ease-in-out yst-duration-150"
							leaveFrom="yst-translate-y-0"
							leaveTo={ classNames( "yst-opacity-0", modalNotificationClassNameMap.position[ position ] ) }
						>
							{ children }
						</Transition.Child>
					</div>
				</Dialog>
			</Transition.Root>
		</ModalNotificationContext.Provider>
	);
};

ModalNotification.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	position: PropTypes.oneOf( Object.keys( modalNotificationClassNameMap.position ) ),
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	initialFocus: PropTypes.oneOfType( [ PropTypes.func, PropTypes.object ] ),
};

ModalNotification.Close = Close;
ModalNotification.Message = Message;
ModalNotification.Title = Title;
ModalNotification.Panel = Panel;

export default ModalNotification;
