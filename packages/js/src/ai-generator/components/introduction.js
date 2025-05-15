import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import { ConsentModal } from "@yoast/ai-frontend";
import { STORE_NAME_AI, STORE_NAME_EDITOR } from "../constants";

/**
 * @param {function} onStartGenerating Callback to signal the generating should start.
 * @returns {JSX.Element} The element.
 */
export const Introduction = ( { onStartGenerating } ) => {
	const termsOfServiceLink = useSelect( select => select( STORE_NAME_EDITOR )
		.selectLink( "https://yoa.st/ai-generator-terms-of-service" ), [] );
	const privacyPolicyLink = useSelect( select => select( STORE_NAME_EDITOR )
		.selectLink( "https://yoa.st/ai-generator-privacy-policy" ), [] );
	const learnMoreLink = useSelect( select => select( STORE_NAME_EDITOR ).selectLink( "https://yoa.st/ai-generator-learn-more" ), [] );

	const imageLink = useSelect( select => select( STORE_NAME_EDITOR ).selectImageLink( "ai-consent.png" ), [] );

	const { storeAiGeneratorConsent } = useDispatch( STORE_NAME_AI );
	const onGiveConsent = useCallback( async() => {
		await storeAiGeneratorConsent( true );
		onStartGenerating();
	}, [ storeAiGeneratorConsent, onStartGenerating ] );

	const props = {
		learnMoreLink,
		termsOfServiceLink,
		privacyPolicyLink,
		imageLink,
		onGiveConsent,
	};

	return (
		<ConsentModal
			{ ...props }
		/>
	);
};
Introduction.propTypes = {
	onStartGenerating: PropTypes.func.isRequired,
};
