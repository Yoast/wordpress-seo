import { Slot } from "@wordpress/components";
import sortComponentsByRenderPriority from "../../helpers/sortComponentsByRenderPriority";

/**
 * Renders the metabox portal.
 *
 * @returns {null|ReactElement} The element.
 */
export default function MetaboxSlot() {
	return (
		<Slot name="YoastMetabox">
			{ ( fills ) => {
				return sortComponentsByRenderPriority( fills );
			} }
		</Slot>
	);
}
