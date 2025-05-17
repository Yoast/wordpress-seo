import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef } from "react";

const classNameMap = {
	variant: {
		"default": "yst-link--default",
		primary: "yst-link--primary",
		error: "yst-link--error",
	},
};

/**
 * @param {JSX.Element} [Component] The component to render as.
 * @param {string} [variant] The variant of the link.
 * @param {string} [className] The HTML classes.
 * @param {JSX.node} children The content of the link.
 * @param {Object} [props] The props.
 * @returns {JSX.Element} The link.
 */
const Link = forwardRef( ( {
	as: Component,
	variant,
	className,
	children,
	...props
}, ref ) => (
	<Component
		ref={ ref }
		className={ classNames(
			"yst-link",
			classNameMap.variant[ variant ],
			className,
		) }
		{ ...props }
	>
		{ children }
	</Component>
) );

Link.displayName = "Link";
Link.propTypes = {
	children: PropTypes.node.isRequired,
	variant: PropTypes.oneOf( Object.keys( classNameMap.variant ) ),
	as: PropTypes.elementType,
	className: PropTypes.string,
};
Link.defaultProps = {
	as: "a",
	variant: "default",
	className: "",
};

export default Link;
