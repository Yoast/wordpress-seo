import { __ } from "@wordpress/i18n";
import { useToggleState } from "@yoast/ui-library";
import { PremiumSEOAnalysisModal } from "../modals/PremiumSEOAnalysisModal";

export const SynonymsUpsell = ( { location } ) => {
	const [ isOpen, , , openModal, closeModal ] = useToggleState( false );
	const buyLink = location.toLowerCase() === "sidebar"
		? "shortlinks.upsell.sidebar.focus_keyword_synonyms_button"
		: "shortlinks.upsell.metabox.focus_keyword_synonyms_button";
	return <>
		<button
			type="button"
			onClick={ openModal }
			className="button-link"
			id="yoast-keyword-synonyms-button"
		>
			{ `+ ${ __( "Add synonyms", "wordpress-seo" ) }` }
		</button>
		<PremiumSEOAnalysisModal
			isOpen={ isOpen }
			closeModal={ closeModal }
			upsellLink={ buyLink }
			id="yoast-synonyms-upsell-modal"
		/>
	</>;
};
