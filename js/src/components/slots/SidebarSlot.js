import { Slot } from "@wordpress/components";
import sortComponentsByRenderPriority from "../../helpers/sortComponentsByRenderPriority";

/**
 * Renders the Sidebar slot.
 *
 * @returns {null|wp.Element} The element.
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
