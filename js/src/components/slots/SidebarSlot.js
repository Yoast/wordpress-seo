import { Slot } from "@wordpress/components";
import sortComponentsByRenderPriority from "../../helpers/sortComponentsByRenderPriority";
import TopLevelProviders from "../TopLevelProviders";

/**
 * Renders the Sidebar slot.
 *
 * @returns {null|wp.Element} The element.
 */
export default function SidebarSlot() {
	return (
		<TopLevelProviders
			store={ store }
			theme={ theme }
			location={ "sidebar" }
		>
			<Slot name="YoastSidebar">
				{ ( fills ) => {
					return sortComponentsByRenderPriority( fills );
				} }
			</Slot>
		</TopLevelProviders>
	);
}
