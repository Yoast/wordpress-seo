/* eslint-disable complexity */
import { Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { isArray, noop } from "lodash";
import PropTypes from "prop-types";
import React, { useCallback, useEffect } from "react";

/**
 * @param {string} title The toaster title.
 * @returns {JSX.Element} The title.
 */
const Title = ( {
	title,
} ) => {
	return <p className="yst-text-sm yst-font-medium yst-text-slate-800">
		{ title }
	</p>;
};

Title.propTypes = {
	title: PropTypes.string.isRequired,
};

/**
 * @param {string} description The toaster description.
 * @returns {JSX.Element} The description.
 */
const Description = ( {
	description,
} ) => {
	return isArray( description ) ? (
		<ul className="yst-list-disc yst-ml-4">
			{ description.map( ( text, index ) => (
				<li className="yst-pt-1" key={ `${ text }-${ index }` }>{ text }</li>
			) ) }
		</ul>
	) : (
		<p>{ description }</p>
	);
};

Description.propTypes = {
	description: PropTypes.oneOfType( [ PropTypes.node, PropTypes.arrayOf( PropTypes.node ) ] ),
};

/**
 * @param {JSX.node} children The children.
 * @returns {JSX.Element} The content.
 */
const Content = ( {
	children,
} ) => {
	return <div className="yst-w-0 yst-flex-1">
		{ children }
	</div>;
};

Content.propTypes = {
	children: PropTypes.node.isRequired,
};

/**
 * @param {Object} props The props object.
 * @param {JSX.node} children The children.
 * @param {string} id The toaster ID.
 * @param {string} [className] Additional classes.
 * @param {Function} [onDismiss] Function to trigger on dismissal.
 * @param {number|null} [autoDismiss] Amount of milliseconds after which the message should auto dismiss, 0 indicating no auto dismiss.
 * @param {string} dismissScreenReaderLabel Screen reader label for dismiss button.
 * @param {boolean} isVisible Whether the notification is visible.
 * @param {Function} setIsVisible Function to set the visibility of the notification.
 * @returns {JSX.Element} The Toaster component.
 */
const Toaster = ( {
	children,
	id,
	className = "",
	onDismiss = noop,
	autoDismiss = null,
	dismissScreenReaderLabel,
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
		<Transition
			show={ isVisible }
			enter={ "yst-transition yst-ease-in-out yst-duration-150" }
			enterFrom={ "yst-opacity-0 yst-translate-y-full" }
			enterTo="yst-translate-y-0"
			leave={ "yst-transition yst-ease-in-out yst-duration-150" }
			leaveFrom="yst-translate-y-0"
			leaveTo={ "yst-opacity-0 yst-translate-y-full" }
			className={ classNames(
				"yst-toaster",
				className,
			) }
			role="alert"
		>
			<div className="yst-flex yst-items-start yst-gap-3">
				{ children }
				{ onDismiss && (
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
				) }
			</div>
		</Transition>
	);
};

Toaster.propTypes = {
	children: PropTypes.node,
	id: PropTypes.string.isRequired,
	className: PropTypes.string,
	onDismiss: PropTypes.func,
	autoDismiss: PropTypes.number,
	dismissScreenReaderLabel: PropTypes.string.isRequired,
	isVisible: PropTypes.bool.isRequired,
	setIsVisible: PropTypes.func.isRequired,
};

Toaster.Title = Title;
Toaster.Description = Description;
Toaster.Content = Content;

export default Toaster;
