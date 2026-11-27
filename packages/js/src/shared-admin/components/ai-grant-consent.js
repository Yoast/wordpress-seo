import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useMemo } from "@wordpress/element";
import { AiConsent } from "./ai-consent";

const DEFAULT_LINKS = {
	termsOfService: "https://yoa.st/ai-generator-terms-of-service",
	privacyPolicy: "https://yoa.st/ai-generator-privacy-policy",
	learnMore: "https://yoa.st/ai-generator-learn-more",
};

/**
 * Connected wrapper for AiConsent that reads link/consent data from WordPress data stores.
 *
 * @param {Object} props Component props.
 * @param {string} props.storeName The store providing consent endpoint and dispatch.
 * @param {Function} props.onConsentGranted Callback to signal actions after consent was granted.
 * @param {string} props.linkStoreName The store providing selectLink/selectImageLink.
 * @param {Object} [props.links={}] Override tracking URLs (termsOfService, privacyPolicy, learnMore).
 * @param {string} [props.links.termsOfService] The terms of service link.
 * @param {string} [props.links.privacyPolicy] The privacy policy link.
 * @param {string} [props.links.learnMore] The learn more link.
 *
 * @returns {JSX.Element} The element.
 */
export const AiGrantConsent = ( { storeName, onConsentGranted, linkStoreName, links = {} } ) => {
	const resolvedLinks = useMemo( () => ( { ...DEFAULT_LINKS, ...links } ), [ links ] );

	const { termsOfServiceLink, privacyPolicyLink, learnMoreLink, imageLink, endpoint } = useSelect(
		select => {
			const linkStore = select( linkStoreName );
			const consentStore = select( storeName );
			return {
				termsOfServiceLink: linkStore.selectLink( resolvedLinks.termsOfService ),
				privacyPolicyLink: linkStore.selectLink( resolvedLinks.privacyPolicy ),
				learnMoreLink: linkStore.selectLink( resolvedLinks.learnMore ),
				imageLink: linkStore.selectImageLink( "ai-consent.jpg" ),
				endpoint: consentStore.selectAiGeneratorConsentEndpoint(),
			};
		},
		[ linkStoreName, storeName, resolvedLinks ]
	);

	const { storeAiGeneratorConsent } = useDispatch( storeName );
	const onGiveConsent = useCallback( async() => {
		const response = await storeAiGeneratorConsent( true, endpoint );

		if ( response !== false ) {
			onConsentGranted();
		}
		return response;
	}, [ storeAiGeneratorConsent, onConsentGranted, endpoint ] );

	return (
		<AiConsent
			termsOfServiceLink={ termsOfServiceLink }
			privacyPolicyLink={ privacyPolicyLink }
			learnMoreLink={ learnMoreLink }
			imageLink={ imageLink }
			onGiveConsent={ onGiveConsent }
			linkStoreName={ linkStoreName }
		/>
	);
};
