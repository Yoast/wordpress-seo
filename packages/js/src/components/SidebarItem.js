/* External dependencies */
import PropTypes from "prop-types";

/**
 * Sidebar item with render priority.
 *
 * @param {wp.Element} children The children.
 * @returns {wp.Element} the sidebar item.
 * @constructor
 */
const SidebarItem = ( { children } ) => {
	return (
		<div>{ children }</div>
	);
};

SidebarItem.propTypes = {
	// eslint-disable-next-line react/no-unused-prop-types
	renderPriority: PropTypes.number.isRequired,
	children: PropTypes.node.isRequired,
};

export default SidebarItem;
