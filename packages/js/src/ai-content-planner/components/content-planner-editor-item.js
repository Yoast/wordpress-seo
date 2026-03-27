import { __ } from "@wordpress/i18n";
import { Button, Root, useToggleState } from "@yoast/ui-library";
import { FeatureModal } from "./feature-modal";

/**
 * The section for the content planner feature in the Yoast sidebar.
 *
 * @param {Object}  props               The component props.
 * @param {string}  props.location      The location where the editor item is rendered. Can be "sidebar" or "metabox".
 * @param {boolean} props.isPremium     Whether the user has a premium subscription.
 * @param {boolean} props.isEmptyCanvas Whether the editor canvas has no content.
 * @returns {JSX.Element} The Content Planner section in the sidebar.
 */
export const ContentPlannerEditorItem = ( { location, isPremium, isEmptyCanvas, upsellLink } ) => {
	const [ isFeatureModalOpen, , , openFeatureModal, closeFeatureModal ] = useToggleState( false );

	return <Root><div className="yst-p-4">
		<Button variant="ai-secondary" onClick={ openFeatureModal } className={ location === "sidebar" ? "yst-w-full" : "" }>
			{ __( "Get content suggestions", "wordpress-seo" ) }
		</Button>
		<FeatureModal
			isOpen={ isFeatureModalOpen }
			onClose={ closeFeatureModal }
			isEmptyCanvas={ isEmptyCanvas }
			isPremium={ isPremium }
			upsellLink={ upsellLink }
		/>
	</div></Root>;
};
