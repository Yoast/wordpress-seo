import { Slot } from "@wordpress/components";
import sortComponentsByRenderPriority from "../../helpers/sortComponentsByRenderPriority";

/**
 * Renders the Elementor slot.
 *
 * @returns {wp.Element} The element.
 */
export default function ElementorSlot() {
	return (
		<Slot name="YoastElementor">
			{ ( fills ) => sortComponentsByRenderPriority( fills ) }
		</Slot>
	);
}
