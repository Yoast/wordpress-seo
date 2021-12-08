import { Fill, Slot } from "@wordpress/components";
import sortComponentsByRenderPriority from "../helpers/sortComponentsByRenderPriority";

export const METABOX_SLOT_NAME = "YoastMetabox";

export const MetaboxSlot = () => (
	<Slot name={ METABOX_SLOT_NAME }>
		{ ( fills ) => {
			return sortComponentsByRenderPriority( fills );
		} }
	</Slot>
);

export const MetaboxFill = ( { children } ) => (
	<Fill name={ METABOX_SLOT_NAME }>
		{ children }
	</Fill>
);
