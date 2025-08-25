import styled from "styled-components";
import { __ } from "@wordpress/i18n";
import { useToggleState } from "@yoast/ui-library";
import { PremiumSEOAnalysisModal } from "../modals/PremiumSEOAnalysisModal";

const StyledButton = styled.button`
	// Increase specificity to override WP rules.
	&& {
		display: flex;
		align-items: center;
	}

	.yoast-svg-icon {
		margin: 1px 7px 0 0;
		fill: currentColor;
	}
`;

export const SynonymsUpsell = ( { location } ) => {
	const [ isOpen, , , openModal, closeModal ] = useToggleState( false );
	const buyLink = location.toLowerCase() === "sidebar"
		? "shortlinks.upsell.sidebar.focus_keyword_synonyms_button"
		: "shortlinks.upsell.metabox.focus_keyword_synonyms_button";
	return <>
		<StyledButton
			type="button"
			onClick={ openModal }
			className="wpseo-keyword-synonyms button-link yoast-modal__button-open"
		>
			{ `+ ${ __( "Add synonyms", "wordpress-seo" ) }` }
		</StyledButton>
		<PremiumSEOAnalysisModal
			isOpen={ isOpen }
			closeModal={ closeModal }
			upsellLink={ buyLink }
			id="yoast-synonyms-upsell-modal"
		/>
	</>;
};
