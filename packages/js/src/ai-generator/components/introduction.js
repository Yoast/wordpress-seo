import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import { AiConsent } from "../../shared-admin/components";
import { STORE_NAME_AI, STORE_NAME_EDITOR } from "../constants";

/**
 * @param {Function} onStartGenerating Callback to signal the generating should start.
 * @returns {JSX.Element} The element.
 */
export const Introduction = ( { onStartGenerating } ) => {
	const { termsOfServiceLink, privacyPolicyLink, learnMoreLink, imageLink, consentEndpoint } = useSelect(
		select => ( {
			termsOfServiceLink: select( STORE_NAME_EDITOR ).selectLink( "https://yoa.st/ai-generator-terms-of-service" ),
			privacyPolicyLink: select( STORE_NAME_EDITOR ).selectLink( "https://yoa.st/ai-generator-privacy-policy" ),
			learnMoreLink: select( STORE_NAME_EDITOR ).selectLink( "https://yoa.st/ai-generator-learn-more" ),
			imageLink: select( STORE_NAME_EDITOR ).selectImageLink( "ai-consent.png" ),
			consentEndpoint: select( STORE_NAME_AI ).selectAiGeneratorConsentEndpoint(),
		} ),
		[]
	);

	const { storeAiGeneratorConsent } = useDispatch( STORE_NAME_AI );
	const onGiveConsent = useCallback( async() => {
		await storeAiGeneratorConsent( true, consentEndpoint );
		onStartGenerating();
	}, [ storeAiGeneratorConsent, onStartGenerating, consentEndpoint ] );

	return (
		<AiConsent
			termsOfServiceLink={ termsOfServiceLink }
			privacyPolicyLink={ privacyPolicyLink }
			learnMoreLink={ learnMoreLink }
			imageLink={ imageLink }
			onGiveConsent={ onGiveConsent }
		/>
	);
};
Introduction.propTypes = {
	onStartGenerating: PropTypes.func.isRequired,
};
