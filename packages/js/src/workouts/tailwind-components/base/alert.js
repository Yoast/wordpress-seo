// Duplicated from admin-ui! ( admin-ui/packages/toolkit/components/alert.js )
// Addition: "success" case, fade in alert.

import { useCallback, useState } from "@wordpress/element";
import { InformationCircleIcon, ExclamationIcon, XCircleIcon, CheckCircleIcon } from "@heroicons/react/solid";
import { PropTypes } from "prop-types";
import classNames from "classnames";
import AnimateHeight from "react-animate-height";

/**
 * Renders the alert component.
 *
 * @param {String} type The type of the alert.
 * @param {*} children The content of the alert.
 *
 * @returns {React.Component} The Alert.
 */
export default function Alert( { type, children, className } ) {
	let icon;
	let color;

	switch ( type ) {
		case "info":
			icon = <InformationCircleIcon aria-hidden="true" className="yst-flex-shrink-0 yst-w-5 yst-h-5 yst-text-blue-500" />;
			color = "yst-bg-blue-100 yst-text-blue-800";
			break;
		case "warning":
			icon = <ExclamationIcon aria-hidden="true" className="yst-flex-shrink-0 yst-w-5 yst-h-5 yst-text-yellow-500" />;
			color = "yst-bg-yellow-100 yst-text-yellow-800";
			break;
		case "error":
			icon = <XCircleIcon aria-hidden="true" className="yst-flex-shrink-0 yst-w-5 yst-h-5 yst-text-red-500" />;
			color = "yst-bg-red-100 yst-text-red-800";
			break;
		case "success":
			icon = <CheckCircleIcon aria-hidden="true" className="yst-flex-shrink-0 yst-w-5 yst-h-5 yst-green-red-500" />;
			color = "yst-bg-green-100 yst-text-green-800";
			break;
	}

	return (
		<div className={ classNames( "yst-flex yst-p-4 yst-rounded-md last:yst-mb-0", color, className ) }>
			{ icon }
			<div className="yst-flex-1 yst-ml-3 yst-text-sm">
				{ children }
			</div>
		</div>
	);
}

Alert.propTypes = {
	type: PropTypes.oneOf( [ "info", "warning", "error", "success" ] ),
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ).isRequired,
	className: PropTypes.string,
};

Alert.defaultProps = {
	type: "info",
	className: "",
};

/**
 * An Alert that expands and fades in.
 * @returns {WPElement} An Alert that expands and fades in.
 */
export function FadeInAlert( { id, isVisible, expandDuration, type, children, className } ) {
	const [ alertOpacity, setAlertOpacity ] = useState( isVisible ? "yst-opacity-100" : "yst-opacity-0" );
	const startOpacityTransition = useCallback( () => {
		setAlertOpacity( "yst-opacity-100" );
	} );

	return <AnimateHeight
		id={ id }
		height={ isVisible ? "auto" : 0 }
		easing="linear"
		duration={ expandDuration }
		onAnimationEnd={ startOpacityTransition }
	>
		<Alert
			type={ type }
			className={ classNames( "yst-transition-opacity yst-duration-300 yst-mt-4", alertOpacity, className ) }
		>
			{ children }
		</Alert>
	</AnimateHeight>;
}

FadeInAlert.propTypes = {
	id: PropTypes.string.isRequired,
	isVisible: PropTypes.bool.isRequired,
	type: PropTypes.oneOf( [ "info", "warning", "error", "success" ] ),
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ).isRequired,
	expandDuration: PropTypes.number,
	className: PropTypes.string,
};

FadeInAlert.defaultProps = {
	expandDuration: 400,
	type: "info",
	className: "",
};
