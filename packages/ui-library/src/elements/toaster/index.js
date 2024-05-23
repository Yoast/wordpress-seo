/* eslint-disable complexity */
import { Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { isArray, noop } from "lodash";
import PropTypes from "prop-types";
import React, { createContext, useCallback, useContext, useEffect } from "react";

const ToasterContext = createContext( { handleDismiss: () => { console.log("test") } } );

export const toasterClassNameMap = {
	position: {
		"bottom-center": "yst-translate-y-full",
		"bottom-left": "yst-translate-y-full",
		"top-center": "yst--translate-y-full",
	},
};

/**
 * @param {string} dismissScreenReaderLabel The screen reader label for the dismiss button.
 * @returns {JSX.Element} The close button.
 */
const Close = ( {
	dismissScreenReaderLabel,
} ) => {
	const { handleDismiss } = useContext( ToasterContext );
	console.log(handleDismiss)
	return (
		<div className="yst-flex-shrink-0 yst-flex">
			<button
				type="button"
				onClick={ handleDismiss }
				className="yst-bg-white yst-rounded-md yst-inline-flex yst-text-slate-400 hover:yst-text-slate-500 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-offset-2 focus:yst-ring-primary-500"
			>
				<span className="yst-sr-only">{ dismissScreenReaderLabel }</span>
				<XIcon className="yst-h-5 yst-w-5" />
			</button>
		</div>
	);
};

Close.propTypes = {
	dismissScreenReaderLabel: PropTypes.string.isRequired,
};

/**
 * @param {string} description The toaster description.
 * @param {string} [className] The additional class names.
 * @returns {JSX.Element} The description.
 */
const Description = ( {
	description,
	className = "",
} ) => {
	return isArray( description ) ? (
		<ul className={ classNames( "yst-list-disc yst-ml-4", className ) }>
			{ description.map( ( text, index ) => (
				<li className="yst-pt-1" key={ `${ text }-${ index }` }>{ text }</li>
			) ) }
		</ul>
	) : (
		<p className={ className }>{ description }</p>
	);
};

Description.propTypes = {
	description: PropTypes.oneOfType( [ PropTypes.node, PropTypes.arrayOf( PropTypes.node ) ] ),
	className: PropTypes.string,
};

/**
 * @param {string} title The toaster title.
 * @param {string} [className] The additional class names.
 * @returns {JSX.Element} The title.
 */
const Title = ( {
	title,
	className = "",
} ) => {
	return <p className={ classNames( "yst-text-sm yst-font-medium yst-text-slate-800", className ) }>
		{ title }
	</p>;
};

Title.propTypes = {
	title: PropTypes.string.isRequired,
	className: PropTypes.string,
};

/**
 * @param {Object} props The props object.
 * @param {JSX.node} children The children.
 * @param {string} id The toaster ID.
 * @param {string} [className] The additional class names.
 * @param {string} position The toaster position.
 * @param {Function} [onDismiss] Function to trigger on dismissal.
 * @param {number|null} [autoDismiss] Amount of milliseconds after which the message should auto dismiss, 0 indicating no auto dismiss.
 * @param {boolean} isVisible Whether the notification is visible.
 * @param {Function} setIsVisible Function to set the visibility of the notification.
 * @returns {JSX.Element} The Toaster component.
 */
const Toaster = ( {
	children,
	id,
	className = "",
	position = "bottom-left",
	onDismiss = noop,
	autoDismiss = null,
	isVisible,
	setIsVisible,
} ) => {
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
		<ToasterContext.Provider value={ { handleDismiss } }>
			<Transition
				show={ isVisible }
				enter={ "yst-transition yst-ease-in-out yst-duration-150" }
				enterFrom={ classNames( "yst-opacity-0", toasterClassNameMap.position[ position ] ) }
				enterTo="yst-translate-y-0"
				leave={ "yst-transition yst-ease-in-out yst-duration-150" }
				leaveFrom="yst-translate-y-0"
				leaveTo={ classNames( "yst-opacity-0", toasterClassNameMap.position[ position ] ) }
				className={ classNames(
					"yst-toaster",
					className,
				) }
				role="alert"
			>
				{ children }
			</Transition>
		</ToasterContext.Provider>
	);
};

Toaster.propTypes = {
	children: PropTypes.node,
	id: PropTypes.string.isRequired,
	className: PropTypes.string,
	position: PropTypes.string,
	onDismiss: PropTypes.func,
	autoDismiss: PropTypes.oneOfType( [ PropTypes.number, null ] ),
	isVisible: PropTypes.bool.isRequired,
	setIsVisible: PropTypes.func.isRequired,
};

Toaster.Close = Close;
Toaster.Description = Description;
Toaster.Title = Title;

export default Toaster;
