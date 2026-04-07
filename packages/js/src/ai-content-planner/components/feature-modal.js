import { Modal } from "@yoast/ui-library";
import { Fragment, useState, useEffect, useCallback } from "@wordpress/element";
import { Transition } from "@headlessui/react";
import { ApproveModal } from "./approve-modal";
import { ContentSuggestionsModal } from "./content-suggestions-modal";
import { ContentOutlineModal } from "./content-outline-modal";
import { ReplaceContentModal } from "./replace-content-modal";
import { Transition } from "@headlessui/react";
import { noop } from "lodash";

const HIDDEN_STYLE = { display: "none" };

/**
 * Returns the display styles for the outline and confirmation panels.
 * Both are kept mounted and toggled via display:none to avoid layout flash.
 *
 * @param {string} status The current modal status.
 * @returns {Object} Styles for each panel.
 */
const getPanelStyles = ( status ) => ( {
	outlineStyle: status === "content-outline" ? null : HIDDEN_STYLE,
	replaceStyle: status === "replace-content" ? null : HIDDEN_STYLE,
} );

/**
 * Returns the enter transition props for the suggestions panel.
 * Applies a cross-fade when coming from the approve modal, instant otherwise.
 *
 * @param {boolean} fromApproveModal Whether the suggestions are entering from the approve modal.
 * @returns {Object} The enter, enterFrom, and enterTo transition class strings.
 */
const getSuggestionsEnterTransition = ( fromApproveModal ) => {
	if ( fromApproveModal ) {
		return {
			enter: "yst-transition-opacity yst-duration-300 yst-delay-300",
			enterFrom: "yst-opacity-0",
			enterTo: "yst-opacity-100",
		};
	}
	return { enter: "", enterFrom: "", enterTo: "" };
};

/**
 * Renders the suggestions modal, with a cross-fade transition when coming from
 * the approve modal and an instant render otherwise.
 *
 * @param {boolean}  isVisible            Whether the suggestions should be shown.
 * @param {boolean}  cameFromApproveModal Whether transitioning from the approve modal.
 * @param {string}   status           The current modal status.
 * @param {boolean}  isPremium        Whether the user has a premium subscription.
 * @param {Function} onSuggestionClick Callback when a suggestion is clicked.
 *
 * @returns {JSX.Element|null} The suggestions panel.
 */
const SuggestionsPanel = ( { isVisible, cameFromApproveModal, status, isPremium, onSuggestionClick } ) => {
	if ( cameFromApproveModal ) {
		const transition = getSuggestionsEnterTransition( true );
		return (
			<Transition
				as={ Fragment }
				show={ isVisible }
				enter={ transition.enter }
				enterFrom={ transition.enterFrom }
				enterTo={ transition.enterTo }
			>
				<div>
					<ContentSuggestionsModal
						status={ status }
						isPremium={ isPremium }
						onSuggestionClick={ onSuggestionClick }
					/>
				</div>
			</Transition>
		);
	}
	if ( ! isVisible ) {
		return null;
	}
	return (
		<ContentSuggestionsModal
			status={ status }
			isPremium={ isPremium }
			onSuggestionClick={ onSuggestionClick }
			skipTransitions={ true }
		/>
	);
};

/**
 * The modal that orchestrates the flow between the approve, content suggestions,
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
	const [ cameFromApproveModal, setCameFromApproveModal ] = useState( false );

	const handleGetSuggestionsClick = useCallback( () => {
		setCameFromApproveModal( true );
		setStatus( "content-suggestions-loading" );
	}, [] );

	const handleSuggestionClick = useCallback( ( suggestion ) => {
		setCameFromApproveModal( false );
		setSelectedSuggestion( suggestion );
		setStatus( "content-outline" );
	}, [] );

	const handleBackToSuggestions = useCallback( () => {
		setStatus( "content-suggestions-success" );
	}, [] );

	const handleRequestAddOutline = useCallback( () => {
		setHasVisitedReplace( true );
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
			setCameFromApproveModal( false );
			setSelectedSuggestion( null );
		}
	}, [ isOpen ] );

	const isSuggestionsVisible = status === "content-suggestions-success" || status === "content-suggestions-loading";

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
				<SuggestionsPanel
					isVisible={ isSuggestionsVisible }
					cameFromApproveModal={ cameFromApproveModal }
					status={ status }
					isPremium={ isPremium }
					onSuggestionClick={ handleSuggestionClick }
				/>
				{ /* Temporary: replace hardcoded outline data with real API response based on selectedSuggestion. */ }
				{ status === "content-outline" && (
					<ContentOutlineModal
						onBack={ handleBackToSuggestions }
						onAddOutline={ onAddOutline }
						sparksLimit={ 10 }
						sparksUsage={ 1 }
						category="WordPress"
						suggestion={ {
							intent: selectedSuggestion.intent,
							title: "The Ultimate Guide to Setting Up Your WordPress Blog",
							description: selectedSuggestion.description,
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
				) }
			</div>
		</Modal>
	);
};
