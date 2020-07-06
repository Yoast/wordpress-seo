import PropTypes from "prop-types";
import {
	replacementVariablesShape,
	recommendedReplacementVariablesShape,
} from "@yoast/search-metadata-previews";

import SettingsReplacementVariableField from "../SettingsReplacementVariableField";
import Portal from "./Portal";

/**
 * Renders a portal for replacevar fields in the search appearance settings.
 *
 * @param {object} target A target element or element ID in which to render the portal.
 * @param {string} label the label for the field.
 * @param {object[]} replacementVariables the replacement variables for the field.
 * @param {string[]} recommendedReplacementVariables the recommended replacement variables for the field.
 * @param {string} fieldId The field ID.
 *
 * @returns {null|wp.Element} The element.
 */
export default function SettingsFieldPortal( { target, label, replacementVariables, recommendedReplacementVariables, fieldId } ) {
	return (
		<Portal target={ target }>
			<SettingsReplacementVariableField
				label={ label }
				replacementVariables={ replacementVariables }
				recommendedReplacementVariables={ recommendedReplacementVariables }
				fieldId={ fieldId }
			/>
		</Portal>
	);
}

SettingsFieldPortal.propTypes = {
	target: PropTypes.object.isRequired,
	label: PropTypes.string.isRequired,
	replacementVariables: replacementVariablesShape,
	recommendedReplacementVariables: recommendedReplacementVariablesShape,
	fieldId: PropTypes.string.isRequired,
};
