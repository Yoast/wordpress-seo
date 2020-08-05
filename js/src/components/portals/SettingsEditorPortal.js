import PropTypes from "prop-types";
import SettingsReplacementVariableEditor from "../SettingsReplacementVariableEditor";
import {
	replacementVariablesShape,
	recommendedReplacementVariablesShape,
} from "@yoast/search-metadata-previews";

import Portal from "./Portal";

/**
 * Renders a portal for the editors in the search appearance settings.
 *
 * @param {object} target A target element or element ID in which to render the portal.
 * @param {object[]} replacementVariables the replacement variables for the editor.
 * @param {string[]} recommendedReplacementVariables the recommended replacement variables for the editor.
 * @param {string} titleTarget The ID of the title field.
 * @param {string} descriptionTarget The id of the description field.
 * @param {boolean} hasPaperStyle Whether the editor should be styled as a paper.
 *
 * @returns {null|wp.Element} The element.
 */
export default function SettingsEditorPortal( {
	target,
	replacementVariables,
	recommendedReplacementVariables,
	titleTarget,
	descriptionTarget,
	hasPaperStyle,
} ) {
	return (
		<Portal target={ target }>
			<SettingsReplacementVariableEditor
				replacementVariables={ replacementVariables }
				recommendedReplacementVariables={ recommendedReplacementVariables }
				titleTarget={ titleTarget }
				descriptionTarget={ descriptionTarget }
				hasPaperStyle={ hasPaperStyle }
			/>
		</Portal>
	);
}

SettingsEditorPortal.propTypes = {
	target: PropTypes.object.isRequired,
	replacementVariables: replacementVariablesShape,
	recommendedReplacementVariables: recommendedReplacementVariablesShape,
	titleTarget: PropTypes.string.isRequired,
	descriptionTarget: PropTypes.string.isRequired,
	hasPaperStyle: PropTypes.bool,
};
