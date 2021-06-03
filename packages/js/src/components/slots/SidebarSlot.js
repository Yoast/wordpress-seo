import { Slot } from "@wordpress/components";
import sortComponentsByRenderPriority from "../../helpers/sortComponentsByRenderPriority";
import TopLevelProviders from "../TopLevelProviders";

/**
 * Renders the Sidebar slot.
 *
 * @param {Object} props The props.
 * @param {Object} props.theme The theme.
 *
 * @returns {null|wp.Element} The element.
 */
export default function SidebarSlot( { theme } ) {
	return (
		<TopLevelProviders
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
