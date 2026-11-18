import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

/**
 * @param {JSX.ElementClass} [as="span"] Base component.
 * @param {string} [className] Extra class.
 * @param {React.ReactNode} [children=null] Content to determine the size.
 * @returns {JSX.Element} The element.
 */
const SkeletonLoader = ( { as: Component = "span", className = "", children = null } ) => {
	return (
		<Component className={ classNames( "yst-skeleton-loader", className ) }>
			{ children && (
				<div className="yst-pointer-events-none yst-invisible">
					{ children }
				</div>
			) }
		</Component>
	);
};
SkeletonLoader.propTypes = {
	as: PropTypes.elementType,
	className: PropTypes.string,
	children: PropTypes.node,
};

export default SkeletonLoader;
