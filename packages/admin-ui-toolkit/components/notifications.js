import { Transition } from "@headlessui/react";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { useState, useCallback, useEffect } from "@wordpress/element";
import { XCircleIcon, CheckCircleIcon, ExclamationIcon, XIcon } from "@heroicons/react/outline";

const TRANSITION_DURATION = 150;

/**
 *
 * @param {Object} props The props object.
 * @param {string} props.type The message type. Either success or error.
 * @param {string} props.title The message title.
 * @param {string|string[]} props.description The message description.
 * @param {Function} props.onDismiss Function to trigger on dismissal.
 * @param {number} props.autoDismiss Amount of milliseconds after which the message should auto dismiss, 0 indicating no auto dismiss.
 * @returns {JSX.Element} The Notification component.
 */
const Notification = ( { id, type, title, description, onDismiss, autoDismiss } ) => {
	const [ isVisible, setIsVisible ] = useState( false );

	const handleDismiss = useCallback( () => {
		// Disable visibility on dismiss to trigger transition.
		setIsVisible( false );
		// Then remove the actual notification after the transition is done.
		setTimeout( () => {
			onDismiss( id );
		}, TRANSITION_DURATION );
	}, [ onDismiss, id ] );

	useEffect( () => {
		// Enable visibility on mount to trigger transition
		setIsVisible( true );
		// Maybe start auto dismiss timer
		let timeout;
		if ( autoDismiss ) {
			timeout = setTimeout( () => {
				handleDismiss();
			}, Math.abs( autoDismiss ) );
		}
		// Cleanup auto dismiss timeout on unmount
		return () => clearTimeout( timeout );
	}, [] );

	return (
		<Transition
			show={ isVisible }
			enter={ `yst-transition yst-ease-in-out yst-duration-${ TRANSITION_DURATION } yst-transform` }
			enterFrom="yst-translate-x-full"
			enterTo="yst-translate-x-0"
			leave={ `yst-transition yst-ease-in-out yst-duration-${ TRANSITION_DURATION } yst-transform` }
			leaveFrom="yst-translate-x-0"
			leaveTo="yst-translate-x-full"
			className="yst-w-80 yst-p-4 yst-bg-white yst-shadow-lg yst-rounded-lg yst-ring-1 yst-ring-black yst-ring-opacity-5 yst-z-20 yst-mb-4"
			role="alert"
		>
			<div className="yst-flex yst-items-start">
				<div className="yst-flex-shrink-0">
					{ type === "error" && <XCircleIcon className="yst-h-5 yst-h-5 yst-text-red-500" /> }
					{ type === "success" && <CheckCircleIcon className="yst-h-5 yst-h-5 yst-text-green-500" /> }
					{ type === "warning" && <ExclamationIcon className="yst-h-5 yst-h-5 yst-text-yellow-500" /> }
				</div>
				<div className="yst-ml-3 yst-w-0 yst-flex-1 yst-pt-0.5">
					<p className="yst-text-sm yst-font-medium yst-text-gray-700">
						{ title }
					</p>
					{ Array.isArray( description ) ? (
						<ul>{ description.map( ( text ) => <li key={ text }>{ text }</li> ) }</ul>
					) : (
						<p>{ description }</p>
					) }
				</div>
				{ onDismiss && (
					<div className="yst-ml-4 yst-flex-shrink-0 yst-flex">
						<button onClick={ handleDismiss } className="yst-bg-white yst-rounded-md yst-inline-flex yst-text-gray-400 hover:yst-text-gray-500 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-indigo-500">
							<span className="yst-sr-only">{ __( "Close", "admin-ui" ) }</span>
							<XIcon className="yst-h-5 yst-w-5" />
						</button>
					</div>
				) }
			</div>
		</Transition>
	);
};

Notification.propTypes = {
	id: PropTypes.string.isRequired,
	type: PropTypes.oneOf( [ "success", "warning", "error" ] ),
	title: PropTypes.string.isRequired,
	description: PropTypes.oneOfType( [ PropTypes.string, PropTypes.arrayOf( PropTypes.string ) ] ),
	onDismiss: PropTypes.func,
	autoDismiss: PropTypes.number,
};

Notification.defaultProps = {
	type: "warning",
	description: "",
	onDismiss: null,
	autoDismiss: null,
};


/**
 * The Notifications component shows general notifications in the top-right corner of the window.
 * @param {Object[]} notifications Array of notifications.
 * @returns {JSX.Element} The Notifications component.
 */
const Notifications = ( { notifications } ) => (
	<div className="yst-fixed yst-right-4 yst-top-4 yst-z-20">
		{ notifications.map( ( message ) => <Notification key={ message.id } { ...message } /> ) }
	</div>
);

Notifications.propTypes = {
	notifications: PropTypes.arrayOf(
		PropTypes.shape( {
			id: PropTypes.string.isRequired,
			type: PropTypes.oneOf( [ "success", "error" ] ),
			title: PropTypes.string.isRequired,
			description: PropTypes.oneOfType( [ PropTypes.string, PropTypes.arrayOf( PropTypes.string ) ] ),
			onDismiss: PropTypes.func,
			autoDismiss: PropTypes.number,
		} ),
	),
};

Notifications.defaultProps = {
	notifications: [],
};

export default Notifications;
