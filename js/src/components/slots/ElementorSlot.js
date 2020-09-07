import { Slot } from "@wordpress/components";
import PropTypes from "prop-types";
import sortComponentsByRenderPriority from "../../helpers/sortComponentsByRenderPriority";
import TopLevelProviders from "../TopLevelProviders";

/**
 * Renders the Elementor slot.
 *
 * @returns {wp.Element} The element.
 */
export default function ElementorSlot( { store, theme } ) {
	return (
		<TopLevelProviders store={ store } theme={ theme } location="sidebar">
			<Slot name="YoastElementor">
				{ ( fills ) => sortComponentsByRenderPriority( fills ) }
			</Slot>
		</TopLevelProviders>
	);
}

ElementorSlot.propTypes = {
	store: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};
