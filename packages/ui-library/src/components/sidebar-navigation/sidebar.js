import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

/**
 * @param {JSX.node} children The menu items.
 * @param {string} className The CSS classname.
 * @returns {JSX.Element} The sidebar element.
 */
const Sidebar = ( { children, className = "" } ) => (
	<nav className={ classNames( "yst-sidebar-navigation__sidebar", className ) }>{ children }</nav>
);

Sidebar.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

export default Sidebar;
