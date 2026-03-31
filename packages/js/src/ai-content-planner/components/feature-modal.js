import { Modal } from "@yoast/ui-library";
import { Fragment, useState, useEffect, useCallback } from "@wordpress/element";
import { ApproveModal } from "./approve-modal";
import { ContentSuggestionsModal } from "./content-suggestions-modal";
import { ContentOutlineModal } from "./content-outline-modal";
import { ReplaceContentModal } from "./replace-content-modal";
import { Transition } from "@headlessui/react";
import { noop } from "lodash";

/**
 * The modal that orchestrates transitions between the approve, content suggestions,
 * and content outline views.
 *
 * @param {boolean}  isOpen        Whether the modal is open or not.
 * @param {function} onClose       The function to call when the modal is closed.
 * @param {boolean}  isEmptyCanvas Whether the post has content or not.
 * @param {boolean}  isPremium     Whether the user has a premium subscription or not.
 * @param {boolean}  isUpsell      Whether the modal is shown as an upsell or not.
 * @param {string}   upsellLink    The link to the upsell page.
 * @param {function} onAddOutline  The function to call when the user adds the outline to the post.
 * @returns {JSX.Element} The Content Planner Feature Modal.
 */
export const FeatureModal = ( { isOpen, onClose, isEmptyCanvas, isPremium, isUpsell, upsellLink, onAddOutline = noop } ) => {
	const [ status, setStatus ] = useState( null );
	const [ selectedSuggestion, setSelectedSuggestion ] = useState( null );

	const handleGetSuggestionsClick = useCallback( () => {
		setStatus( "content-suggestions-loading" );
	}, [] );

	const handleSuggestionClick = useCallback( ( suggestion ) => {
		setSelectedSuggestion( suggestion );
		setStatus( "content-outline" );
	}, [] );

	const handleBackToSuggestions = useCallback( () => {
		setStatus( "content-suggestions-success" );
	}, [] );

	const handleRequestAddOutline = useCallback( () => {
		setStatus( "replace-content" );
	}, [] );

	const handleCancelReplace = useCallback( () => {
		setStatus( "content-outline" );
	}, [] );

	const handleConfirmReplace = useCallback( () => {
		onAddOutline();
		onClose();
	}, [ onAddOutline, onClose ] );

	useEffect( () => {
		// Delay setting the status to "idle" and "content-suggestions-success" to allow the assistive technology to announce the changes.
		if ( status === null ) {
			const timer = setTimeout( () => setStatus( "idle" ), 300 );
			return () => clearTimeout( timer );
		}
		if ( status === "content-suggestions-loading" ) {
			const timer = setTimeout( () => setStatus( "content-suggestions-success" ), 5000 );
			return () => clearTimeout( timer );
		}
	}, [ status ] );

	useEffect( () => {
		if ( ! isOpen ) {
			setStatus( "idle" );
		}
	}, [ isOpen ] );

	return (
		<Modal isOpen={ isOpen } onClose={ onClose }>
			<div className="yst-relative yst-w-full yst-max-w-2xl">
				<Transition
					as={ Fragment }
					show={ status === "idle" }
					enter="yst-transition-opacity yst-duration-300"
					enterFrom="yst-opacity-0"
					enterTo="yst-opacity-100"
					leave="yst-transition-opacity yst-duration-300 yst-absolute yst-inset-0 yst-m-auto"
					leaveFrom="yst-opacity-100"
					leaveTo="yst-opacity-0"
				>
					<div className="yst-w-96 yst-flex yst-items-center yst-justify-center yst-mx-auto">
						<ApproveModal
							isEmptyCanvas={ isEmptyCanvas }
							isPremium={ isPremium }
							isUpsell={ isUpsell }
							onClick={ handleGetSuggestionsClick }
							upsellLink={ upsellLink }
						/>
					</div>
				</Transition>
				{ /*
				 * yst-delay-300 matches the approve modal's leave duration (yst-duration-300)
				 * so the suggestions only fade in after the approve panel has faded out.
				 */ }
				<Transition
					as={ Fragment }
					show={ status === "content-suggestions-success" || status === "content-suggestions-loading" }
					enter="yst-transition-opacity yst-duration-300 yst-delay-300"
					enterFrom="yst-opacity-0"
					enterTo="yst-opacity-100"
					leave="yst-transition-opacity yst-duration-300 yst-absolute yst-inset-0"
					leaveFrom="yst-opacity-100"
					leaveTo="yst-opacity-0"
				>
					<div>
						<ContentSuggestionsModal
							status={ status }
							isPremium={ isPremium }
							onSuggestionClick={ handleSuggestionClick }
						/>
					</div>
				</Transition>
				{ /*
				 * yst-delay-300 matches the suggestions modal's leave duration (yst-duration-300)
				 * so the outline only fades in after the suggestions panel has faded out.
				 */ }
				<Transition
					as={ Fragment }
					show={ status === "content-outline" }
					enter="yst-transition-opacity yst-duration-300 yst-delay-300"
					enterFrom="yst-opacity-0"
					enterTo="yst-opacity-100"
					leave="yst-transition-opacity yst-duration-300 yst-absolute yst-inset-0"
					leaveFrom="yst-opacity-100"
					leaveTo="yst-opacity-0"
				>
					<div>
						<ContentOutlineModal
							onBack={ handleBackToSuggestions }
							onAddOutline={ handleRequestAddOutline }
							sparksLimit={ 10 }
							sparksUsage={ 1 }
							category="WordPress"
							suggestion={ {
								intent: selectedSuggestion ? selectedSuggestion.intent : "informational",
								title: "The Ultimate Guide to Setting Up Your WordPress Blog",
								description: selectedSuggestion
									? selectedSuggestion.description
									: "This content is suggested because it addresses a common entry point for new users.",
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
					</div>
				</Transition>
				<Transition
					as={ Fragment }
					show={ status === "replace-content" }
					enter="yst-transition-opacity yst-duration-300 yst-delay-300"
					enterFrom="yst-opacity-0"
					enterTo="yst-opacity-100"
					leave="yst-transition-opacity yst-duration-300 yst-absolute yst-inset-0"
					leaveFrom="yst-opacity-100"
					leaveTo="yst-opacity-0"
				>
					<div className="yst-flex yst-items-center yst-justify-center">
						<ReplaceContentModal
							onClose={ handleCancelReplace }
							onConfirm={ handleConfirmReplace }
						/>
					</div>
				</Transition>
			</div>
		</Modal>
	);
};
