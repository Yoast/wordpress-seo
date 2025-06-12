import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import { AiConsent } from "../../shared-admin/components";
import { STORE_NAME_AI, STORE_NAME_EDITOR } from "../constants";
import { DISPLAY } from "./app";

/**
 * @param {Function} setDisplay Callback to set the display state.
 * @returns {JSX.Element} The element.
 */
export const Introduction = ( { setDisplay } ) => {
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
		setDisplay( DISPLAY.generate );
	}, [ storeAiGeneratorConsent, setDisplay, consentEndpoint ] );

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
	setDisplay: PropTypes.func.isRequired,
};
