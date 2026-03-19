
import { NextPostApproveModal } from "./next-post-approve-modal";
import { Button, Root, useToggleState } from "@yoast/ui-library";
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";

/**
 * The section for the next post feature in the Yoast sidebar.
 *
 * @param {string} location The location where the editor item is rendered. Can be "sidebar" or "metabox".
 * @returns {JSX.Element} The Next Post section in the sidebar.
 */
export const NextPostEditorItem = ( { location } ) => {
	const [ isModalOpen, , , openModal, closeModal ] = useToggleState( false );
	const { isPremium, textLength } = useSelect( select => {
		return {
			isPremium: select( "yoast-seo/editor" ).getIsPremium(),
			textLength: select( "yoast-seo/editor" ).getTextLength(),
		};
	}, [] );

	// The canvas is empty when the word count is zero.
	const isEmptyCanvas = textLength.count === 0;

	return <Root><div className="yst-p-4">
		<Button variant="ai-secondary" onClick={ openModal } className={ location === "sidebar" ? "yst-w-full" : "" }>
			{ __( "Get content suggestions", "wordpress-seo" ) }
		</Button>
		<NextPostApproveModal
			isOpen={ isModalOpen }
			onClose={ closeModal }
			isEmptyCanvas={ isEmptyCanvas }
			isPremium={ isPremium }
			isUpsell={ false }
		/>
	</div>
	</Root>;
};
