import { Slot } from "@wordpress/components";
import sortComponentsByRenderPriority from "../../../helpers/sortComponentsByRenderPriority";
import { ErrorBoundary } from "@yoast/ui-library";
import { ElementorErrorFallback } from "../elementor-error-fallback";

/**
 * Renders the Elementor slot.
 *
 * @returns {wp.Element} The element.
 */
export default function ElementorSlot() {
	return (
		<ErrorBoundary FallbackComponent={ ElementorErrorFallback }>
			<Slot name="YoastElementor">
				{ ( fills ) => sortComponentsByRenderPriority( fills ) }
			</Slot>
		</ErrorBoundary>
	);
}
