import { __ } from "@wordpress/i18n";
import { Button, Root, useToggleState } from "@yoast/ui-library";
import { FeatureModal } from "./feature-modal";

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
		/>
		<ContentSuggestionsModal
			isOpen={ isContentSuggestionModalOpen }
			onClose={ closeContentSuggestionModal }
			onSuggestionClick={ handleSuggestionClick }
			isPremium={ isPremium }
		/>
		<ContentOutlineModal
			isOpen={ isContentOutlineModalOpen }
			onClose={ closeContentOutlineModal }
			onBack={ handleBackToSuggestions }
			onAddOutline={ handleAddOutline }
			sparksLimit={ 10 }
			sparksUsage={ 1 }
			category="WordPress"
			suggestion={ {
				intent: selectedSuggestion ? selectedSuggestion.intent : "informational",
				title: "The Ultimate Guide to Setting Up Your WordPress Blog",
				description: selectedSuggestion ? selectedSuggestion.description : "This content is suggested because it addresses a common entry point for new users.",
				focusKeyphrase: "Guide to set up WordPress blog",
				metaDescription: "A comprehensive tutorial covering WordPress installation, theme selection, and essential plugins. In this article, we'll explore everything you need to know to get started and achieve success.",
				structure: [
					{ level: "H2", title: "Introduction" },
					{ level: "H2", title: "Why This Matters" },
					{ level: "H2", title: "Step-by-Step Guide" },
					{ level: "H2", title: "Common Mistakes to Avoid" },
					{ level: "H2", title: "Best Practices" },
					{ level: "H2", title: "Conclusion" },
					{ level: "FAQ", title: "FAQ" },
				],
			} }
		/>
		<ReplaceContentModal
			isOpen={ isReplaceContentModalOpen }
			onClose={ closeReplaceContentModal }
			onConfirm={ handleReplaceContent }
		/>
	</div>
	</Root>;
};
