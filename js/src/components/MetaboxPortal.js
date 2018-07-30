import Metabox from "../containers/Metabox";
import sortComponentsByRenderPriority from "../helpers/sortComponentsByRenderPriority";

/**
 * Renders the metabox portal.
 *
 * @param {string} target a target element ID in which to render the portal.
 * @param {Object} store The Redux store.
 *
 * @returns {null|ReactElement} The element.
 */
export default function MetaboxPortal( { target, store } ) {
	const metaboxElement = document.getElementById( target );

	if ( ! metaboxElement ) {
		return null;
	}

	const { Slot } = wp.components;
	const { Fragment } = yoast._wp.element;

	return yoast._wp.element.createPortal(
		<Fragment>
			<Slot name="YoastMetabox">
				{ ( fills ) => {
					return sortComponentsByRenderPriority( fills );
				} }
			</Slot>
			<Metabox store={ store } />
		</Fragment>,
		metaboxElement
	);
}
