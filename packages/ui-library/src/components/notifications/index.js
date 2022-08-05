/* eslint-disable complexity */
import { Transition } from "@headlessui/react";
import PropTypes from "prop-types";
import { useState, useCallback, useEffect, useContext, createContext } from "@wordpress/element";
import { XCircleIcon, CheckCircleIcon, ExclamationIcon, XIcon, InformationCircleIcon } from "@heroicons/react/outline";
import { isArray, keys } from "lodash";
import classNames from "classnames";

const NotificationsContext = createContext( { position: "bottom-left" } );

/**
 * @returns {Object} Value of the notifications context.
 */
const useNotificationsContext = () => useContext( NotificationsContext );

const notificationClassNameMap = {
	variant: {
		info: "yst-notification--info",
		warning: "yst-notification--warning",
		success: "yst-notification--success",
		error: "yst-notification--error",
	},
	position: {
		"bottom-center": "yst-translate-y-full",
		"bottom-left": "yst-translate-y-full",
		"top-center": "yst--translate-y-full",
	},
	size: {
		"default": "",
		large: "yst-notification--large",
	},
};

const notificationsIconMap = {
	info: InformationCircleIcon,
	warning: ExclamationIcon,
	success: CheckCircleIcon,
	error: XCircleIcon,
};

/**
 *
 * @param {Object} props The props object.
 * @param {JSX.node} children The children.
 * @param {string} [variant] The message variant. Either success or error.
 * @param {string} title The message title.
 * @param {string|string[]} [description] The message description.
 * @param {Function} [onDismiss] Function to trigger on dismissal.
 * @param {number} [autoDismiss] Amount of milliseconds after which the message should auto dismiss, 0 indicating no auto dismiss.
 * @param {string} dismissScreenReaderLabel Screen reader label for dismiss button.
 * @returns {JSX.Element} The Notification component.
 */
const Notification = ( {
	children,
	id,
	variant = "info",
	size = "default",
	title,
	description = "",
	onDismiss = null,
	autoDismiss = null,
	dismissScreenReaderLabel,
} ) => {
	const { position } = useNotificationsContext();
	const [ isVisible, setIsVisible ] = useState( false );
	const Icon = notificationsIconMap[ variant ];

	const handleDismiss = useCallback( () => {
		// Disable visibility on dismiss to trigger transition.
		setIsVisible( false );
		// Then remove the actual notification after the transition is done.
		setTimeout( () => {
			onDismiss( id );
		}, 150 );
	}, [ onDismiss, id ] );

	useEffect( () => {
		// Enable visibility on mount to trigger transition.
		setIsVisible( true );
		// Maybe start auto dismiss timer.
		let timeout;
		if ( autoDismiss ) {
			timeout = setTimeout( () => {
				handleDismiss();
			}, autoDismiss );
		}
		// Cleanup auto dismiss timeout on unmount.
		return () => clearTimeout( timeout );
	}, [] );

	return (
		<Transition
			show={ isVisible }
			enter={ "yst-transition yst-ease-in-out yst-duration-150" }
			enterFrom={ classNames( "yst-opacity-0", notificationClassNameMap.position[ position ] ) }
			enterTo="yst-translate-y-0"
			leave={ "yst-transition yst-ease-in-out yst-duration-150" }
			leaveFrom="yst-translate-y-0"
			leaveTo={ classNames( "yst-opacity-0", notificationClassNameMap.position[ position ] ) }
			className={ classNames(
				"yst-notification",
				notificationClassNameMap.variant[ variant ],
				notificationClassNameMap.size[ size ],
			) }
			role="alert"
		>
			<div className="yst-flex yst-items-start yst-gap-3">
				<div className="yst-flex-shrink-0">
					<Icon className="yst-notification__icon" />
				</div>
				<div className="yst-w-0 yst-flex-1">
					<p className="yst-text-sm yst-font-medium yst-text-gray-700">
						{ title }
					</p>
					{ children || (
						description && ( isArray( description ) ? (
							<ul className="yst-list-disc yst-ml-4">{ description.map( ( text, index ) => <li className="yst-pt-1" key={ `${ text }-${ index }` }>{ text }</li> ) }</ul>
						) : (
							<p>{ description }</p>
						) )
					) }
				</div>
				{ onDismiss && (
					<div className="yst-flex-shrink-0 yst-flex">
						<button onClick={ handleDismiss } className="yst-bg-white yst-rounded-md yst-inline-flex yst-text-gray-400 hover:yst-text-gray-500 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-indigo-500">
							<span className="yst-sr-only">{ dismissScreenReaderLabel }</span>
							<XIcon className="yst-h-5 yst-w-5" />
						</button>
					</div>
				) }
			</div>
		</Transition>
	);
};

Notification.propTypes = {
	children: PropTypes.node,
	id: PropTypes.string.isRequired,
	variant: PropTypes.oneOf( keys( notificationClassNameMap.variant ) ),
	size: PropTypes.oneOf( keys( notificationClassNameMap.size ) ),
	title: PropTypes.string.isRequired,
	description: PropTypes.oneOfType( [ PropTypes.node, PropTypes.arrayOf( PropTypes.node ) ] ),
	onDismiss: PropTypes.func,
	autoDismiss: PropTypes.number,
	dismissScreenReaderLabel: PropTypes.string.isRequired,
};

const notificationsClassNameMap = {
	position: {
		"bottom-center": "yst-notifications--bottom-center",
		"bottom-left": "yst-notifications--bottom-left",
		"top-center": "yst-notifications--top-center",
	},
};

/**
 * The Notifications component shows notifications on a specified position on the screen.
 * @param {JSX.Element} children The children.
 * @param {string} position Position on screen.
 * @returns {JSX.Element} The Notifications element.
 */
const Notifications = ( {
	children,
	position = "bottom-left",
} ) => (
	<NotificationsContext.Provider value={ { position } }>
		<aside
			className={ classNames(
				"yst-notifications",
				notificationsClassNameMap.position[ position ],
			) }
		>
			{ children }
		</aside>
	</NotificationsContext.Provider>
);

Notifications.propTypes = {
	children: PropTypes.node,
	position: PropTypes.oneOf( keys( notificationsClassNameMap.position ) ),
};

Notifications.Notification = Notification;

export default Notifications;
