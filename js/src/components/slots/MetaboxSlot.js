import { Slot } from "@wordpress/components";
import sortComponentsByRenderPriority from "../../helpers/sortComponentsByRenderPriority";
import TopLevelProviders from "../TopLevelProviders";

/**
 * Renders the metabox portal.
 *
 * @returns {null|wp.Element} The element.
 */
export default function MetaboxSlot( { store, theme } ) {
	return (
		<TopLevelProviders
			store={ store }
			theme={ theme }
			location={ "metabox" }
		>
			<Slot name="YoastMetabox">
				{ ( fills ) => {
					return sortComponentsByRenderPriority( fills );
				} }
			</Slot>
		</TopLevelProviders>
	);
}
