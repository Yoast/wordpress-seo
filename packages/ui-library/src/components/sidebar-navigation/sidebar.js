import PropTypes from "prop-types";

/**
 * @param {JSX.node} children The menu items.
 * @param {string} className The CSS classname.
 * @returns {JSX.Element} The sidebar element.
 */
const Sidebar = ( { children, className = "" } ) => (
	<nav className={ className }>{ children }</nav>
);

Sidebar.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

export default Sidebar;
