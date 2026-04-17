import PropTypes from "prop-types";
import { AiGrantConsent } from "../../shared-admin/components";
import { STORE_NAME_AI_CONSENT } from "../constants";

const LINKS = {
	termsOfService: "https://yoa.st/ai-fix-assessments-terms-of-service",
	privacyPolicy: "https://yoa.st/ai-fix-assessments-privacy-policy",
	learnMore: "https://yoa.st/ai-fix-assessments-consent-learn-more",
};

/**
 * The modal content for granting consent to use the AI features.
 *
 * @param {function} onStartGenerating Callback to start generating content after consent is given.
 *
 * @returns {JSX.Element} The element.
 */
export const GrantConsent = ( { onStartGenerating } ) => (
	<AiGrantConsent
		storeName={ STORE_NAME_AI_CONSENT }
		onConsentGranted={ onStartGenerating }
		links={ LINKS }
	/>
);
GrantConsent.propTypes = {
	onStartGenerating: PropTypes.func.isRequired,
};
