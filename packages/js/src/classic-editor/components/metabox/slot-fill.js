import { Fill, Slot } from "@wordpress/components";
import { PropTypes } from "prop-types";
import sortComponentsByRenderPriority from "../../../helpers/sortComponentsByRenderPriority";

export const METABOX_SLOT_NAME = "YoastMetabox";

/**
 * Creates a metabox slot.
 *
 * @returns {JSX.Element} A metabox slot.
 */
export const MetaboxSlot = () => (
	<Slot name={ METABOX_SLOT_NAME }>
		{ ( fills ) => {
			return sortComponentsByRenderPriority( fills );
		} }
	</Slot>
);

/**
 * Creates a metabox fill.
 *
 * @returns {JSX.Element} A metabox fill.
 */
export const MetaboxFill = ( { children } ) => (
	<Fill name={ METABOX_SLOT_NAME }>
		{ children }
	</Fill>
);

MetaboxFill.propTypes = {
	children: PropTypes.node,
};

MetaboxFill.defaultProps = {
	children: null,
};
