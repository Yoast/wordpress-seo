import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

/**
 * @param {React.ReactNode} [as="div"] What component to render as.
 * @param {string} [className=""] Optional extra className.
 * @param {React.ReactNode} children The content.
 * @returns {React.ReactElement} The element.
 */
const Content = ( { as: Component = "div", className = "", children } ) => (
	<Component className={ classNames( "yst-paper__content", className ) }>
		{ children }
	</Component>
);

Content.propTypes = {
	as: PropTypes.node,
	className: PropTypes.string,
	children: PropTypes.node.isRequired,
};

export default Content;
