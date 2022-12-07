import PropTypes from "prop-types";
import { keys } from "lodash";
import { CheckCircleIcon, ExclamationIcon, InformationCircleIcon, ExclamationCircleIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { useSvgAria } from "../../hooks";

const CLASSNAME_MAP = {
	variant: {
		success: "yst-validation-icon--success",
		warning: "yst-validation-icon--warning",
		info: "yst-validation-icon--info",
		error: "yst-validation-icon--error",
	},
};

const ICON_MAP = {
	success: CheckCircleIcon,
	warning: ExclamationIcon,
	info: InformationCircleIcon,
	error: ExclamationCircleIcon,
};

/**
 * @param {string} variant The variant to render.
 * @returns {JSX.Element} The ValidationIcon component.
 */
const ValidationIcon = ( {
	variant = "info",
	className = "",
	...props
} ) => {
	const Component = ICON_MAP[ variant ];
	const svgAriaProps = useSvgAria();

	return Component ? (
		<Component { ...svgAriaProps } { ...props } className={ classNames( "yst-validation-icon", CLASSNAME_MAP.variant[ variant ], className ) } />
	) : null;
};

ValidationIcon.propTypes = {
	variant: PropTypes.oneOf( keys( ICON_MAP ) ),
	className: PropTypes.string,
};

export default ValidationIcon;
