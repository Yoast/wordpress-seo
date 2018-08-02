/* External dependencies */
import React from "react";

/* Internal dependencies */
import withYoastSidebarPriority from "./higherorder/withYoastSidebarPriority";

const SidebarItem = withYoastSidebarPriority( ( { children } ) => {
	return <div>{ children }</div>;
} );

export default SidebarItem;
