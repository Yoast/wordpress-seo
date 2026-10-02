import { Slot } from "@wordpress/components";
import PropTypes from "prop-types";
import { getAssessmentButtonSlotName } from "../../analysis/constants";
import { useLocation } from "../../ai-generator/hooks/use-location";

/**
 * Renders the slot that sits next to an assessment result.
 *
 * The location comes from the context rather than a prop, because the slot name has to differ per location and
 * the analysis renders in both the metabox and the sidebar at the same time.
 *
 * @param {Object} props    The props.
 * @param {string} props.id The assessment identifier.
 *
 * @returns {JSX.Element} The slot.
 */
export default function AssessmentButtonSlot( { id } ) {
	return <Slot name={ getAssessmentButtonSlotName( id, useLocation() ) } />;
}

AssessmentButtonSlot.propTypes = {
	id: PropTypes.string.isRequired,
};
