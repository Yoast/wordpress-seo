import { Slot } from "@wordpress/components";
import { createPortal, Fragment } from "@wordpress/element";

import Metabox from "../containers/Metabox";
import sortComponentsByRenderPriority from "../helpers/sortComponentsByRenderPriority";

/**
 * Renders the metabox portal.
 *
 * @param {string} target A target element ID in which to render the portal.
 * @param {Object} store  The Redux store.
 * @param {Object} theme  The theme to use.
 *
 * @returns {null|ReactElement} The element.
 */
export default function MetaboxPortal( { target, store, theme } ) {
	const metaboxElement = document.getElementById( target );

	if ( ! metaboxElement ) {
		return null;
	}

	return createPortal(
		<Fragment>
			<Slot name="YoastMetabox">
				{ ( fills ) => {
					return sortComponentsByRenderPriority( fills );
				} }
			</Slot>
			<Metabox store={ store } theme={ theme } />
		</Fragment>,
		metaboxElement
	);
}
