import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

/**
 * @param {React.ReactNode} [as="header"] What component to render as.
 * @param {string} [className=""] Optional extra className.
 * @param {React.ReactNode} children The content.
 * @returns {React.ReactElement} The element.
 */
const Header = ( { as: Component, className, children } ) => (
	<Component className={ classNames( "yst-paper__header", className ) }>
		{ children }
	</Component>
);

Header.propTypes = {
	as: PropTypes.node,
	className: PropTypes.string,
	children: PropTypes.node.isRequired,
};

Header.defaultProps = {
	as: "header",
	className: "",
};

export default Header;
