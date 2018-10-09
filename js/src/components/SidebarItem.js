/* External dependencies */
import React from "react";

import addLocationContext from "./higherorder/addLocationContext"

/* Internal dependencies */
import withYoastSidebarPriority from "./higherorder/withYoastSidebarPriority";

const SidebarItem = withYoastSidebarPriority( addLocationContext( ( { children } ) => {
	return <div>{ children }</div>;
}, "sidebar" ) );

export default SidebarItem;
