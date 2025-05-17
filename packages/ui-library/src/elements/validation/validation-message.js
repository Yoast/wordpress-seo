import classNames from "classnames";
import { keys } from "lodash";
import PropTypes from "prop-types";
import React from "react";

const CLASSNAME_MAP = {
	variant: {
		success: "yst-validation-message--success",
		warning: "yst-validation-message--warning",
		info: "yst-validation-message--info",
		error: "yst-validation-message--error",
	},
};

/**
 * @param {string|function} [as="p"] The component to render as.
 * @param {string} [variant="info"] The variant.
 * @param {JSX.node} [children=""] The validation message.
 * @param {string} [className=""] The class name.
 * @returns {JSX.Element} The ValidationMessage component.
 */
const ValidationMessage = ( {
	as: Component = "p",
	variant = "info",
	children,
	className = "",
	...props
} ) => (
	<Component { ...props } className={ classNames( "yst-validation-message", CLASSNAME_MAP.variant[ variant ], className ) }>
		{ children }
	</Component>
);

ValidationMessage.propTypes = {
	as: PropTypes.elementType,
	variant: PropTypes.oneOf( keys( CLASSNAME_MAP.variant ) ),
	message: PropTypes.node,
	className: PropTypes.string,
	children: PropTypes.node.isRequired,
};

export default ValidationMessage;
