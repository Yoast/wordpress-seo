/* External dependencies */
import PropTypes from "prop-types";

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
