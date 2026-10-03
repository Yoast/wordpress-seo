import { Slot } from "@wordpress/components";
import { ErrorBoundary } from "@yoast/ui-library";
import sortComponentsByRenderPriority from "../../helpers/sortComponentsByRenderPriority";
import { MetaboxErrorFallback } from "../metabox-error-fallback";
import TopLevelProviders from "../TopLevelProviders";

/**
 * Renders the metabox portal.
 *
 * @param {Object} theme The theme.
 *
 * @returns {JSX.Element} The element.
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
