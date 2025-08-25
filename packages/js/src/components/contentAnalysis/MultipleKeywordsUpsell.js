/* global wpseoAdminL10n */
import { __ } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import { useToggleState } from "@yoast/ui-library";
import { MultiKeyphraseUpsellModal } from "../modals/MultiKeyphraseUpsellModal";

/**
 *
 * @param {string} location The location where the upsell is used. Either "sidebar" or "metabox".
 * @param {string} locationContext The context of the location where the upsell is used
 *
 * @returns {JSX.Element} The Multiple Keywords upsell component.
 */
export const MultipleKeywordsUpsell = ( { location, locationContext } ) => {
	const [ isOpen, , , openModal, closeModal ] = useToggleState( false );
	const buyLink = location.toLowerCase() === "sidebar"
		? "shortlinks.upsell.sidebar.focus_keyword_additional_button"
		: "shortlinks.upsell.metabox.focus_keyword_additional_button";

	const upsellLink = addQueryArgs( wpseoAdminL10n[ buyLink ], { context: locationContext } );
	return <>
		<button
			type="button"
			onClick={ openModal }
			className="button-link yst-block"
			id={ `yoast-keyword-related-keyphrase-button-${location}` }
		>
			{ `+ ${ __( "Add related keyphrase", "wordpress-seo" ) }` }
		</button>
		<MultiKeyphraseUpsellModal
			isOpen={ isOpen }
			closeModal={ closeModal }
			id={ `yoast-related-keyphrase-upsell-modal-${location}` }
			upsellLink={ upsellLink }
		/>
	</>;
};
