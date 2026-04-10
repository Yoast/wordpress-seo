import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useMemo } from "@wordpress/element";
import PropTypes from "prop-types";
import { AiConsent } from "./ai-consent";

const DEFAULT_LINKS = {
	termsOfService: "https://yoa.st/ai-generator-terms-of-service",
	privacyPolicy: "https://yoa.st/ai-generator-privacy-policy",
	learnMore: "https://yoa.st/ai-generator-learn-more",
};

/**
 * Connected wrapper for AiConsent that reads link/consent data from WordPress data stores.
 *
 * @param {string}   storeName        The store providing consent endpoint and dispatch.
 * @param {Function} onConsentGranted Callback fired after consent is successfully stored.
 * @param {string}   [linkStoreName]  The store providing selectLink/selectImageLink. Defaults to storeName.
 * @param {Object}   [links]          Override tracking URLs (termsOfService, privacyPolicy, learnMore).
 *
 * @returns {JSX.Element} The element.
 */
export const AiGrantConsent = ( { storeName, onConsentGranted, linkStoreName, links } ) => {
	const resolvedLinks = useMemo( () => ( { ...DEFAULT_LINKS, ...links } ), [ links ] );
	const resolvedLinkStore = linkStoreName || storeName;

	const { termsOfServiceLink, privacyPolicyLink, learnMoreLink, imageLink, endpoint } = useSelect(
		select => {
			const linkStore = select( resolvedLinkStore );
			const consentStore = select( storeName );
			return {
				termsOfServiceLink: linkStore.selectLink( resolvedLinks.termsOfService ),
				privacyPolicyLink: linkStore.selectLink( resolvedLinks.privacyPolicy ),
				learnMoreLink: linkStore.selectLink( resolvedLinks.learnMore ),
				imageLink: linkStore.selectImageLink( "ai-consent.png" ),
				endpoint: consentStore.selectAiGeneratorConsentEndpoint(),
			};
		},
		[ resolvedLinkStore, storeName, resolvedLinks ]
	);

	const { storeAiGeneratorConsent } = useDispatch( storeName );
	const onGiveConsent = useCallback( async() => {
		await storeAiGeneratorConsent( true, endpoint );
		onConsentGranted();
	}, [ storeAiGeneratorConsent, onConsentGranted, endpoint ] );

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
AiGrantConsent.propTypes = {
	storeName: PropTypes.string.isRequired,
	onConsentGranted: PropTypes.func.isRequired,
	linkStoreName: PropTypes.string,
	links: PropTypes.shape( {
		termsOfService: PropTypes.string,
		privacyPolicy: PropTypes.string,
		learnMore: PropTypes.string,
	} ),
};
