import { Collapsible } from "@yoast/components";

/**
 * Sidebar Collapsible component with default padding and separator
 *
 * @param {Object} props The properties for the component.
 *
 * @returns {wp.Element} The Collapsible component.
 */
const SidebarCollapsible = ( props ) => {
	return <Collapsible hasPadding={ true } hasSeparator={ true } { ...props } />;
};

export default SidebarCollapsible;
