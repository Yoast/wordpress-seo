import { __ } from "@wordpress/i18n";
import { UpsellModal } from "../modals/UpsellModal";

/**
 * MultiKeyphraseUpsellModal component.
 *
 *
 * @returns {JSX.Element} The rendered modal.
 */
export const MultiKeyphraseUpsellModal = ( {
	isOpen, closeModal, id, upsellLink,
} ) => {
	return <UpsellModal
		isOpen={ isOpen }
		onClose={ closeModal }
		id={ id }
		upsellLink={ upsellLink }
		title={ __( "Cover more search intent with related keyphrases", "wordpress-seo" ) }
		description={ __( "Optimize for up to 5 keyphrases to shape your content around different themes, audiences, and angles - helping it get discovered by a wider audience.", "wordpress-seo" ) }
		note={ __( "Fine-tune your content for every audience", "wordpress-seo" ) }
		modalTitle={ __( "Target multiple keyphrases", "wordpress-seo" ) }
		ctbId="f6a84663-465f-4cb5-8ba5-f7a6d72224b2"
	/>;
};
