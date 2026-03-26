import { __ } from "@wordpress/i18n";
import { Button, Root, useToggleState } from "@yoast/ui-library";
import { ApproveModal } from "./approve-modal";
import { ContentSuggestionsModal } from "./content-suggestions-modal";
import { ContentOutlineModal } from "./content-outline-modal";
import { ReplaceContentModal } from "./replace-content-modal";
import { useCallback, useState } from "@wordpress/element";

/**
 * The section for the content planner feature in the Yoast sidebar.
 *
 * @param {Object}  props               The component props.
 * @param {string}  props.location      The location where the editor item is rendered. Can be "sidebar" or "metabox".
 * @param {boolean} props.isPremium     Whether the user has a premium subscription.
 * @param {boolean} props.isEmptyCanvas Whether the editor canvas has no content.
 * @param {string}  props.upsellLink    The link to the upsell page.
 * @returns {JSX.Element} The Content Planner section in the sidebar.
 */
export const ContentPlannerEditorItem = ( { location, isPremium, isEmptyCanvas, upsellLink } ) => {
	const [ isApproveModalOpen, , , openApproveModal, closeApproveModal ] = useToggleState( false );
	const [ isContentSuggestionModalOpen, , , openContentSuggestionModal, closeContentSuggestionModal ] = useToggleState( false );
	const [ isContentOutlineModalOpen, , , openContentOutlineModal, closeContentOutlineModal ] = useToggleState( false );
	const [ isReplaceContentModalOpen, , , openReplaceContentModal, closeReplaceContentModal ] = useToggleState( false );
	const [ selectedSuggestion, setSelectedSuggestion ] = useState( null );

	const handleSuggestionClick = useCallback( ( suggestion ) => {
		setSelectedSuggestion( suggestion );
		closeContentSuggestionModal();
		setTimeout( openContentOutlineModal, 200 );
	}, [ closeContentSuggestionModal, openContentOutlineModal ] );

	const handleBackToSuggestions = useCallback( () => {
		closeContentOutlineModal();
		setTimeout( openContentSuggestionModal, 200 );
	}, [ closeContentOutlineModal, openContentSuggestionModal ] );

	const handleAddOutline = useCallback( () => {
		openReplaceContentModal();
	}, [ openReplaceContentModal ] );

	const handleReplaceContent = useCallback( () => {
		closeReplaceContentModal();
		closeContentOutlineModal();
		// Will be addressed in future iterations — actual content replacement logic.
	}, [ closeReplaceContentModal, closeContentOutlineModal ] );

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
