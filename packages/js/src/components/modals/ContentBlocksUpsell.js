/* global wpseoAdminL10n */
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import { useRootContext } from "@yoast/externals/contexts";
import PropTypes from "prop-types";

import { UpsellModal } from "./UpsellModal.js";
import { BenefitItems } from "../contentBlocks/BenefitItems.js";

/**
 * ContentBlocksUpsell component.
 * @param {Object} props Component props.
 * @param {boolean} isOpen  Whether the modal is open.
 * @param {function} closeModal Function to close the modal.
 * @param {string} location Location where the upsell is shown. Either "sidebar" or "metabox".
 * @returns {JSX.Element} The ContentBlocksUpsell component.
 */
export const ContentBlocksUpsell = ( { isOpen, closeModal, location } ) => {
	const { locationContext } = useRootContext();
	const buyLink = wpseoAdminL10n[
		location === "sidebar"
			? "shortlinks.upsell.sidebar.content_blocks"
			: "shortlinks.upsell.metabox.content_blocks"
	];
	const upsellId = "yoast-content-blocks-upsell";
	const renderBenefitItems = useCallback( () => {
		return (
			<BenefitItems id={ upsellId } />
		);
	}, [] );

	return (
		<UpsellModal
			isOpen={ isOpen }
			onClose={ closeModal }
			id="yoast-content-blocks-upsell"
			upsellLink={ addQueryArgs( buyLink, { context: locationContext } ) }
			modalTitle={ __( "Add rich content blocks with Premium", "wordpress-seo" ) }
			title={ __( "Make your post more engaging at a click", "wordpress-seo" ) }
			description={ __( "Add rich elements that improve readability, structure, and SEO. Easily insert smart blocks to enrich your content directly in the Block Editor. Includes:", "wordpress-seo" ) }
			benefits={ renderBenefitItems }
			note={ __( "Get a tailored experience for the Block Editor", "wordpress-seo" ) }
			ctbId="f6a84663-465f-4cb5-8ba5-f7a6d72224b2"
		/>

	);
};

ContentBlocksUpsell.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	closeModal: PropTypes.func.isRequired,
	location: PropTypes.oneOf( [ "sidebar", "metabox" ] ).isRequired,
};
