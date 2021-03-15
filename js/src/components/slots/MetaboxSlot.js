import { Slot } from "@wordpress/components";
import sortComponentsByRenderPriority from "../../helpers/sortComponentsByRenderPriority";
import TopLevelProviders from "../TopLevelProviders";

/**
 * Renders the metabox portal.
 *
 * @param {Object} props The props.
 * @param {Object} props.theme The theme.
 *
 * @returns {null|wp.Element} The element.
 */
export default function MetaboxSlot( { theme } ) {
	return (
		<TopLevelProviders
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
