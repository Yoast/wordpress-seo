import { Slot } from "@wordpress/components";
import sortComponentsByRenderPriority from "../../helpers/sortComponentsByRenderPriority";
import TopLevelProviders from "../TopLevelProviders";
import { ErrorBoundary } from "@yoast/ui-library";
import { MetaboxErrorFallback } from "../metabox-error-fallback";

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
			<ErrorBoundary FallbackComponent={ MetaboxErrorFallback }>
				<Slot name="YoastMetabox">
					{ ( fills ) => {
						return sortComponentsByRenderPriority( fills );
					} }
				</Slot>
			</ErrorBoundary>
		</TopLevelProviders>
	);
}
