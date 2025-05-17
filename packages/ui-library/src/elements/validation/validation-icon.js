import classNames from "classnames";
import { values } from "lodash";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useSvgAria } from "../../hooks";
import { VALIDATION_ICON_MAP, VALIDATION_VARIANTS } from "./constants";

const CLASSNAME_MAP = {
	variant: {
		success: "yst-validation-icon--success",
		warning: "yst-validation-icon--warning",
		info: "yst-validation-icon--info",
		error: "yst-validation-icon--error",
	},
};

/**
 * @param {string} variant The variant to render.
 * @param {string} className The classname.
 * @param {Object} [props] Any extra props.
 * @returns {JSX.Element} The ValidationIcon component.
 */
const ValidationIcon = ( {
	variant = "info",
	className = "",
	...props
} ) => {
	const Component = useMemo( () => VALIDATION_ICON_MAP[ variant ], [ variant ] );
	const svgAriaProps = useSvgAria();

	return Component ? (
		<Component { ...svgAriaProps } { ...props } className={ classNames( "yst-validation-icon", CLASSNAME_MAP.variant[ variant ], className ) } />
	) : null;
};

ValidationIcon.propTypes = {
	variant: PropTypes.oneOf( values( VALIDATION_VARIANTS ) ),
	className: PropTypes.string,
};

export default ValidationIcon;
