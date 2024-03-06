import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const positionClassNameMap = {
	top: "yst-tooltip--top",
	right: "yst-tooltip--right",
	bottom: "yst-tooltip--bottom",
	left: "yst-tooltip--left",
};

/**
 * @param {string} id ID.
 * @param {string} children Content of the tooltip.
 * @param {string|JSX.Element} [as] Base component.
 * @param {string} [className] CSS class.
 * @param {string} [position] Position of the tooltip.
 * @param {boolean} isVisible Default state.
 * @returns {JSX.Element} Tooltip component.
 */
const Tooltip = forwardRef( ( { id, children, as: Component, className, isVisible, position, ...props }, ref ) => {
	return (
		<>
			{ isVisible && (
				<Component
					ref={ ref }
					className={ classNames( "yst-tooltip",
						positionClassNameMap[ position ],
						className,
					) }
					role="tooltip"
					id={ id }
					{ ...props }
				>
					{ children || null }
				</Component>
			) }
		</>
	);
} );

Tooltip.displayName = "Tooltip";
Tooltip.propTypes = {
	as: PropTypes.elementType,
	id: PropTypes.string.isRequired,
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
