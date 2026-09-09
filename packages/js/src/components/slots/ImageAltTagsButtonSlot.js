import { Slot } from "@wordpress/components";
import { getImageAltTagsButtonSlotName } from "../../analysis/constants";
import { useLocation } from "../../ai-generator/hooks/use-location";

/**
 * Renders the slot that sits next to the Image alt attributes assessment result.
 *
 * The location comes from the context rather than a prop, because the slot name has to differ per location and
 * the analysis renders in both the metabox and the sidebar at the same time.
 *
 * @returns {JSX.Element} The slot.
 */
export default function ImageAltTagsButtonSlot() {
	return <Slot name={ getImageAltTagsButtonSlotName( useLocation() ) } />;
}
