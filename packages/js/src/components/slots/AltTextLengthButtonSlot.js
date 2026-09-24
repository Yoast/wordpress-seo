import { Slot } from "@wordpress/components";
import { getAltTextLengthButtonSlotName } from "../../analysis/constants";
import { useLocation } from "../../ai-generator/hooks/use-location";

/**
 * Renders the slot that sits next to the Alt text length assessment result.
 *
 * The location comes from the context rather than a prop, because the slot name has to differ per location and
 * the analysis renders in both the metabox and the sidebar at the same time.
 *
 * @returns {JSX.Element} The slot.
 */
export default function AltTextLengthButtonSlot() {
	return <Slot name={ getAltTextLengthButtonSlotName( useLocation() ) } />;
}
