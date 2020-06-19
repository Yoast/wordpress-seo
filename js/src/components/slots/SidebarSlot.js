import { Slot } from "@wordpress/components";
import sortComponentsByRenderPriority from "../../helpers/sortComponentsByRenderPriority";
import React from "react";

/**
 * Renders the Sidebar slot.
 *
 * @returns {null|ReactElement} The element.
 */
export default function SidebarSlot() {
	return (
		<Slot name="YoastSidebar">
			{ ( fills ) => {
				return sortComponentsByRenderPriority( fills );
			} }
		</Slot>
	);
}
