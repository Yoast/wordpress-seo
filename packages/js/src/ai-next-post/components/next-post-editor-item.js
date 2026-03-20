import { NextPostApproveModal } from "./next-post-approve-modal";
import { Button, Root, useToggleState } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";

/**
 * The section for the next post feature in the Yoast sidebar.
 *
 * @param {Object}  props               The component props.
 * @param {string}  props.location      The location where the editor item is rendered. Can be "sidebar" or "metabox".
 * @param {boolean} props.isPremium     Whether the user has a premium subscription.
 * @param {boolean} props.isEmptyCanvas Whether the editor canvas has no content.
 * @returns {JSX.Element} The Next Post section in the sidebar.
 */
export const NextPostEditorItem = ( { location, isPremium, isEmptyCanvas } ) => {
	const [ isModalOpen, , , openModal, closeModal ] = useToggleState( false );

	return <Root><div className="yst-p-4">
		<Button variant="ai-secondary" onClick={ openModal } className={ location === "sidebar" ? "yst-w-full" : "" }>
			{ __( "Get content suggestions", "wordpress-seo" ) }
		</Button>
		<NextPostApproveModal
			isOpen={ isModalOpen }
			onClose={ closeModal }
			isEmptyCanvas={ isEmptyCanvas }
			isPremium={ isPremium }
			// Will be addressed in future iterations.
			isUpsell={ false }
		/>
	</div>
	</Root>;
};
