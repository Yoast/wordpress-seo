import React from "react";
import { Collapsible } from "yoast-components";

/**
 * Sidebar Collapsible component with default padding and separator
 *
 * @param {object} props The properties for the component.
 */
const SidebarCollapsible = ( props ) => {
	return <Collapsible hasPadding={true} hasSeparator={true} {...props} />;
};

export default SidebarCollapsible;
