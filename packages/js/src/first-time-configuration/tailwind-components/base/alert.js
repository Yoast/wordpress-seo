/* eslint-disable complexity */
// Duplicated from admin-ui! ( admin-ui/packages/toolkit/components/alert.js )
// Addition: "success" case, fade in alert.

import CheckCircleIcon from "@heroicons/react/solid/CheckCircleIcon";
import ExclamationIcon from "@heroicons/react/solid/ExclamationIcon";
import InformationCircleIcon from "@heroicons/react/solid/InformationCircleIcon";
import XCircleIcon from "@heroicons/react/solid/XCircleIcon";
import { useCallback, useState } from "@wordpress/element";
import classNames from "classnames";
import AnimateHeight from "react-animate-height";

/**
 * Renders the alert component.
 *
 * @param {Object} props Component props.
 * @param {("info"|"warning"|"error"|"success")} [props.type="info"] The type of the alert.
 * @param {React.ReactNode} props.children The content of the alert.
 * @param {string} [props.className=""] The class name for the alert.
 *
 * @returns {JSX.Element} The Alert.
 */
export default function Alert( { type = "info", children, className = "" } ) {
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
			icon = <CheckCircleIcon aria-hidden="true" className="yst-flex-shrink-0 yst-w-5 yst-h-5 yst-text-emerald-600" />;
			color = "yst-bg-green-100 yst-text-green-800";
			break;
	}

	return (
		<div className={ classNames( "yst-flex yst-p-4 yst-rounded-md", color, className ) }>
			{ icon }
			<div className="yst-flex-1 yst-ms-3 yst-text-sm">
				{ children }
			</div>
		</div>
	);
}

/**
 * An Alert that expands and fades in.
 *
 * @param {Object} props Component props.
 * @param {string} props.id The id for the alert.
 * @param {boolean} props.isVisible Whether the alert is visible.
 * @param {("info"|"warning"|"error"|"success")} [props.type="info"] The type of the alert.
 * @param {React.ReactNode} props.children The content of the alert.
 * @param {number} [props.expandDuration=400] The expand animation duration.
 * @param {string} [props.className=""] The class name for the alert.
 *
 * @returns {JSX.Element} An Alert that expands and fades in.
 */
export function FadeInAlert( {
	id,
	isVisible,
	expandDuration = 400,
	type = "info",
	children,
	className = "",
} ) {
	const [ alertOpacity, setAlertOpacity ] = useState( isVisible ? "yst-opacity-100" : "yst-opacity-0" );
	const startOpacityTransition = useCallback( () => {
		setAlertOpacity( "yst-opacity-100" );
	}, [] );

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
