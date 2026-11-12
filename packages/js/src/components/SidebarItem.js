/**
 * Sidebar item with render priority.
 *
 * @param {Object} props Component props.
 * @param {number} props.renderPriority The render priority, used to sort the sidebar items.
 * @param {wp.Element} props.children The children.
 *
 * @returns {wp.Element} the sidebar item.
 * @constructor
 */
const SidebarItem = ( { children } ) => {
	return (
		<div>{ children }</div>
	);
};

export default SidebarItem;
