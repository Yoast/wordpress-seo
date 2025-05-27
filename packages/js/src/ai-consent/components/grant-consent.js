import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { AiConsent } from "../../shared-admin/components";
import { STORE_NAME_AI_CONSENT } from "../constants";

/**
 * The modal content for granting consent to use the AI features.
 *
 * @param {function} onStartGenerating Callback to start generating content after consent is given.
 *
 * @returns {JSX.Element} The element.
 */
export const GrantConsent = ( { onStartGenerating } ) => {
	const termsOfServiceLink = useSelect( select => select( STORE_NAME_AI_CONSENT )
		.selectLink( "https://yoa.st/ai-fix-assessments-terms-of-service" ), [] );
	const privacyPolicyLink = useSelect( select => select( STORE_NAME_AI_CONSENT )
		.selectLink( "https://yoa.st/ai-fix-assessments-privacy-policy" ), [] );

	const learnMoreLink = useSelect( select => select( STORE_NAME_AI_CONSENT ).selectLink( "https://yoa.st/ai-fix-assessments-consent-learn-more" ), [] );

	const imageLink = useSelect( select => select( STORE_NAME_AI_CONSENT ).selectImageLink( "ai-consent.png" ), [] );

	const { storeAiGeneratorConsent } = useDispatch( STORE_NAME_AI_CONSENT );
	const handleGiveConsent = useCallback( () => {
		storeAiGeneratorConsent( true );
		onStartGenerating();
	}, [ storeAiGeneratorConsent, onStartGenerating ] );

	return (
		<AiConsent
			imageLink={ imageLink }
			onGiveConsent={ handleGiveConsent }
			learnMoreLink={ learnMoreLink }
			termsOfServiceLink={ termsOfServiceLink }
			privacyPolicyLink={ privacyPolicyLink }
		/>
	);
};
