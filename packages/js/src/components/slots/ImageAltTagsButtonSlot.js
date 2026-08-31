import { Slot } from "@wordpress/components";
import { LocationConsumer } from "@yoast/externals/contexts";
import { getImageAltTagsButtonSlotName } from "../../analysis/constants";

/**
 * Renders the slot that sits next to the Image alt attributes assessment result.
 *
 * The location is read from the context rather than taken as a prop, because the slot name has to differ per
 * location and the analysis renders in both the metabox and the sidebar at the same time.
 *
 * @returns {JSX.Element} The slot.
 */
export default function ImageAltTagsButtonSlot() {
	return (
		<LocationConsumer>
			{ location => <Slot name={ getImageAltTagsButtonSlotName( location ) } /> }
		</LocationConsumer>
	);
}
