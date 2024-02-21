import { createSlotFill } from "@wordpress/components";
import sortComponentsByRenderPriority from "../../helpers/sortComponentsByRenderPriority";

const SLOT_FILL_NAME = "yoast-seo/woocommerce-editor/seo";

const { Slot, Fill } = createSlotFill( SLOT_FILL_NAME );

/**
 * @returns {JSX.Element} The element.
 */
export const SeoSlot = () => (
	<Slot>
		{ ( fills ) => sortComponentsByRenderPriority( fills ) }
	</Slot>
);

export const SeoFill = Fill;
