import { __ } from "@wordpress/i18n";
import { Button, Root, useToggleState } from "@yoast/ui-library";
import { ApproveModal } from "./approve-modal";
import { ContentSuggestionsModal } from "./content-suggestions-modal";
import { get } from "lodash";

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
	const [ isApproveModalOpen, , , openApproveModal, closeApproveModal ] = useToggleState( false );
	const [ isContentSuggestionModalOpen, , , openContentSuggestionModal, closeContentSuggestionModal ] = useToggleState( false );
	// Used for testing only, will be addressed in future iterations.
	const isLoading = get( window, "contentPlanner.isLoading", false );

	return <Root><div className="yst-p-4">
		<Button variant="ai-secondary" onClick={ openApproveModal } className={ location === "sidebar" ? "yst-w-full" : "" }>
			{ __( "Get content suggestions", "wordpress-seo" ) }
		</Button>
		<ApproveModal
			isOpen={ isApproveModalOpen }
			onClose={ closeApproveModal }
			isEmptyCanvas={ isEmptyCanvas }
			isPremium={ isPremium }
			onClick={ openContentSuggestionModal }
			// Will be addressed in future iterations.
			isUpsell={ false }
			upsellLink={ upsellLink }
		/>
		<ContentSuggestionsModal
			isOpen={ isContentSuggestionModalOpen }
			onClose={ closeContentSuggestionModal }
			isLoading={ isLoading }
			isPremium={ isPremium }
			suggestions={ [
				{
					intent: "informational",
					title: "How to train your dog",
					description: "Tips and tricks on how to train your dog effectively.",
				},
				{
					intent: "navigational",
					title: "Best dog training schools in New York",
					description: "A list of the best dog training schools in New York.",
				},
				{
					intent: "commercial",
					title: "Top 10 dog training tools",
					description: "A review of the top 10 dog training tools on the market.",
				},
				{
					intent: "informational",
					title: "How to groom your dog",
					description: "Step-by-step guide on how to groom your dog at home.",
				},
				{
					intent: "navigational",
					title: "Dog parks in Los Angeles",
					description: "Find the best dog parks in Los Angeles for your furry friend.",
				},
				{
					intent: "commercial",
					title: "Best dog food brands",
					description: "An overview of the best dog food brands for a healthy diet.",
				},
			] }
		/>
	</div>
	</Root>;
};
