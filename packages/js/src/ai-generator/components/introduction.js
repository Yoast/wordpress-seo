import PropTypes from "prop-types";
import { AiGrantConsent } from "../../shared-admin/components";
import { STORE_NAME_AI, STORE_NAME_EDITOR } from "../constants";

/**
 * Introduction modal content for the AI generation of titles and descriptions.
 *
 * @param {Function} onStartGenerating Callback to signal the generating should start.
 * @returns {JSX.Element} The element.
 */
export const Introduction = ( { onStartGenerating } ) => (
	<AiGrantConsent
		storeName={ STORE_NAME_AI }
		linkStoreName={ STORE_NAME_EDITOR }
		onConsentGranted={ onStartGenerating }
	/>
);
Introduction.propTypes = {
	onStartGenerating: PropTypes.func.isRequired,
};
