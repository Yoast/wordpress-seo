import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef } from "react";

const positionClassNameMap = {
	top: "yst-tooltip--top",
	right: "yst-tooltip--right",
	bottom: "yst-tooltip--bottom",
	left: "yst-tooltip--left",
};

/**
 * @param {string} children Content of the tooltip.
 * @param {string|JSX.Element} [as] Base component.
 * @param {string} [className] CSS class.
 * @param {string} [position] Position of the tooltip.
 * @returns {JSX.Element} Tooltip component.
 */

const Tooltip = forwardRef( ( { children, as: Component, className, position, ...props }, ref ) => {
	return (
		<Component
			ref={ ref }
			className={ classNames( "yst-tooltip",
				positionClassNameMap[ position ],
				className,
			) }
			role="tooltip"
			{ ...props }
		>
			{ children || null }
		</Component>
	);
} );

Tooltip.displayName = "Tooltip";
Tooltip.propTypes = {
	as: PropTypes.elementType,
	id: PropTypes.string,
	children: PropTypes.string,
	className: PropTypes.string,
	position: PropTypes.oneOf( Object.keys( positionClassNameMap ) ),
};
Tooltip.defaultProps = {
	as: "div",
	children: "",
	className: "",
	position: "top",
};

export default Tooltip;
