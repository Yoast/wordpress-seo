/* eslint-disable complexity */
import classNames from "classnames";
import { keys, noop } from "lodash";
import PropTypes from "prop-types";
import React, { createContext, useContext, useState } from "react";
import { ValidationIcon } from "../../elements/validation";
import Toast from "../../elements/toast";
const NotificationsContext = createContext( { position: "bottom-left" } );

/**
 * @returns {Object} Value of the notifications context.
 */
export const useNotificationsContext = () => useContext( NotificationsContext );

export const notificationClassNameMap  = {
	variant: {
		info: "yst-notification--info",
		warning: "yst-notification--warning",
		success: "yst-notification--success",
		error: "yst-notification--error",
	},
	size: {
		"default": "",
		large: "yst-notification--large",
	},
};

/**
 * @param {Object} props The props object.
 * @param {JSX.node} children The children.
 * @param {string} [variant] The message variant. Either success or error.
 * @param {string} [size] The message size. Either default or large.
 * @param {string} [title] The message title.
 * @param {string|string[]} [description] The message description.
 * @param {Function} [onDismiss] Function to trigger on dismissal.
 * @param {number|null} [autoDismiss] Amount of milliseconds after which the message should auto dismiss, 0 indicating no auto dismiss.
 * @param {string} dismissScreenReaderLabel Screen reader label for dismiss button.
 * @returns {JSX.Element} The Notification component.
 */
const Notification = ( {
	children,
	id,
	variant = "info",
	size = "default",
	title = "",
	description = "",
	onDismiss = noop,
	autoDismiss = null,
	dismissScreenReaderLabel,
} ) => {
	const { position } = useNotificationsContext();
	const [ isVisible, setIsVisible ] = useState( false );

	return (
		<Toast
			id={ id }
			className={ classNames(
				"yst-notification",
				notificationClassNameMap.variant[ variant ],
				notificationClassNameMap.size[ size ],
			) }
			position={ position }
			size={ size }
			onDismiss={ onDismiss }
			autoDismiss={ autoDismiss }
			dismissScreenReaderLabel={ dismissScreenReaderLabel }
			isVisible={ isVisible }
			setIsVisible={ setIsVisible }
		>
			<div className="yst-flex yst-items-start yst-gap-3">
				<div className="yst-flex-shrink-0">
					<ValidationIcon variant={ variant } className="yst-notification__icon" />
				</div>
				<div className="yst-w-0 yst-flex-1">
					{ title && <Toast.Title title={ title } /> }
					{ children || (
						description && ( <Toast.Description description={ description } /> )
					) }
				</div>
				{ onDismiss && (
					<Toast.Close dismissScreenReaderLabel={ dismissScreenReaderLabel } />
				) }
			</div>
		</Toast>
	);
};

Notification.propTypes = {
	children: PropTypes.node,
	id: PropTypes.string.isRequired,
	variant: PropTypes.oneOf( keys( notificationClassNameMap.variant ) ),
	size: PropTypes.oneOf( keys( notificationClassNameMap.size ) ),
	title: PropTypes.string,
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
 * @param {string} [className] Additional class names.
 * @param {string} position Position on screen.
 * @param {Object} [props] Additional props.
 * @returns {JSX.Element} The Notifications element.
 */
const Notifications = ( {
	children,
	className = "",
	position = "bottom-left",
	...props
} ) => (
	<NotificationsContext.Provider value={ { position } }>
		<aside
			className={ classNames(
				"yst-notifications",
				notificationsClassNameMap.position[ position ],
				className,
			) }
			{ ...props }
		>
			{ children }
		</aside>
	</NotificationsContext.Provider>
);

Notifications.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	position: PropTypes.oneOf( keys( notificationsClassNameMap.position ) ),
};

Notifications.Notification = Notification;
Notifications.Notification.displayName = "Notifications.Notification";

export default Notifications;
