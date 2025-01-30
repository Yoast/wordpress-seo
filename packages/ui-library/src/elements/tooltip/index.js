import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef } from "react";

const positionClassNameMap = {
	top: "yst-tooltip--top",
	right: "yst-tooltip--right",
	bottom: "yst-tooltip--bottom",
	left: "yst-tooltip--left",
};

const variantClassNameMap = {
	light: "yst-tooltip--light",
	dark: "",
};

/**
 * @param {JSX.node} children Content of the tooltip.
 * @param {string|JSX.Element} [as] Base component.
 * @param {string} [className] CSS class.
 * @param {string} [position] Position of the tooltip.
 * @param {string} [variant] Variant of the tooltip.
 * @returns {JSX.Element} Tooltip component.
 */
const Tooltip = forwardRef( ( { children, as: Component, className, position, ...props }, ref ) => {
	return (
		<Component
			ref={ ref }
			className={ classNames( "yst-tooltip",
				positionClassNameMap[ position ],
				variantClassNameMap[ props.variant ],
				className,
			) }
			role="tooltip"
			{ ...props }
		>
			{ children }
		</Component>
	);
} );

Tooltip.displayName = "Tooltip";
Tooltip.propTypes = {
	as: PropTypes.elementType,
	children: PropTypes.node,
	className: PropTypes.string,
	position: PropTypes.oneOf( Object.keys( positionClassNameMap ) ),
	variant: PropTypes.oneOf( [ "dark", "light" ] ),
};
Tooltip.defaultProps = {
	as: "div",
	children: null,
	className: "",
	position: "top",
	variant: "dark",
};

export default Tooltip;
