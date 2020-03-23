/* External dependencies */
import React from "react";
import PropTypes from "prop-types";

const SidebarItem = ( { renderPriority, children } ) => {
	return (
		<div>{ children }</div>
	);
};

SidebarItem.propTypes = {
	renderPriority: PropTypes.number.isRequired,
	children: PropTypes.node.isRequired
};

export default SidebarItem;
