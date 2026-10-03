import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

/**
 * @param {JSX.node} children The menu items.
 * @param {string} className The CSS classname.
 * @param {Object} [props] Extra props, e.g. an `aria-label` to name the navigation landmark.
 * @returns {JSX.Element} The sidebar element.
 */
const Sidebar = ( { children, className = "", ...props } ) => (
	<nav className={ classNames( "yst-sidebar-navigation__sidebar", className ) } { ...props }>{ children }</nav>
);

Sidebar.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

export default Sidebar;
