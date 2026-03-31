import { __ } from "@wordpress/i18n";
import { useCallback } from "@wordpress/element";
import { Button, Root, useToggleState } from "@yoast/ui-library";
import { FeatureModal } from "./feature-modal";
import { ReplaceContentModal } from "./replace-content-modal";

/**
 * The section for the content planner feature in the Yoast sidebar.
 *
 * @param {Object}  props               The component props.
 * @param {string}  props.location      The location where the editor item is rendered. Can be "sidebar" or "metabox".
 * @param {boolean} props.isPremium     Whether the user has a premium add-on activated.
 * @param {boolean} props.isEmptyCanvas Whether the editor canvas has no content.
 * @param {boolean} props.isUpsell     Whether to show the upsell variant of the modal.
 * @param {string}  props.upsellLink   The link to the upsell page for the content planner feature.
 * @returns {JSX.Element} The Content Planner section in the sidebar.
 */
export const ContentPlannerEditorItem = ( { location, isPremium, isEmptyCanvas, isUpsell, upsellLink } ) => {
	const [ isFeatureModalOpen, , , openFeatureModal, closeFeatureModal ] = useToggleState( false );
	const [ isReplaceContentModalOpen, , , openReplaceContentModal, closeReplaceContentModal ] = useToggleState( false );

	const handleAddOutline = useCallback( () => {
		openReplaceContentModal();
	}, [ openReplaceContentModal ] );

	const handleReplaceContent = useCallback( () => {
		closeReplaceContentModal();
		closeFeatureModal();
	}, [ closeReplaceContentModal, closeFeatureModal ] );

	return <Root><div className="yst-p-4">
		<Button variant="ai-secondary" onClick={ openFeatureModal } className={ location === "sidebar" ? "yst-w-full" : "" }>
			{ __( "Get content suggestions", "wordpress-seo" ) }
		</Button>
		<FeatureModal
			isOpen={ isFeatureModalOpen }
			onClose={ closeFeatureModal }
			isEmptyCanvas={ isEmptyCanvas }
			isPremium={ isPremium }
			isUpsell={ isUpsell }
			upsellLink={ upsellLink }
			onAddOutline={ handleAddOutline }
		/>
		<ReplaceContentModal
			isOpen={ isReplaceContentModalOpen }
			onClose={ closeReplaceContentModal }
			onConfirm={ handleReplaceContent }
		/>
	</div>
	</Root>;
};
