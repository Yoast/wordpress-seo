import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

/**
 * @param {string|JSX.Element} [as] Base component.
 * @param {string} [className] Extra class.
 * @param {JSX.node} [children] Content to determine the size.
 * @returns {JSX.Element} The element.
 */
const SkeletonLoader = ( { as: Component, className, children } ) => {
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
SkeletonLoader.defaultProps = {
	as: "span",
	className: "",
	children: null,
};

export default SkeletonLoader;
