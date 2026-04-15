import { Modal } from "@yoast/ui-library";
import { Fragment, useState, useEffect, useCallback, useRef } from "@wordpress/element";
import { useDispatch, useSelect, select } from "@wordpress/data";
import { ApproveModal } from "./approve-modal";
import { ContentSuggestionsModal } from "./content-suggestions-modal";
import { ContentOutlineModal } from "./content-outline-modal";
import { ReplaceContentModal } from "./replace-content-modal";
import { Transition } from "@headlessui/react";
import { noop } from "lodash";
import { buildBlocksFromOutline } from "../helpers/build-blocks-from-outline";
import { applyPostMetaFromOutline } from "../helpers/apply-post-meta-from-outline";
import { FEATURE_MODAL_STATUS, CONTENT_PLANNER_STORE } from "../constants";
import { ASYNC_ACTION_STATUS } from "../../shared-admin/constants";

const HIDDEN_STYLE = { display: "none" };

/**
 * Returns the display styles for the outline and confirmation panels.
 * Both are kept mounted and toggled via display:none to avoid layout flash.
 *
 * @param {string} status The current modal status.
 * @returns {Object} Styles for each panel.
 */
/**
 * Returns visibility and display styles for modal panels based on the current status.
 *
 * @param {string} status The current modal status.
 * @returns {Object} Panel visibility flags and styles.
 */
const getPanelVisibility = ( status ) => ( {
	isSuggestionsVisible:
		status === FEATURE_MODAL_STATUS.contentSuggestionsSuccess ||
		status === FEATURE_MODAL_STATUS.contentSuggestionsLoading ||
		status === FEATURE_MODAL_STATUS.contentSuggestionsError,
	outlineStyle: ( status === FEATURE_MODAL_STATUS.contentOutline || status === FEATURE_MODAL_STATUS.contentOutlineError ) ? null : HIDDEN_STYLE,
	replaceStyle: status === FEATURE_MODAL_STATUS.replaceContent ? null : HIDDEN_STYLE,
} );

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
const SuggestionsPanel = ( { isVisible, cameFromApproveModal, status, isPremium, onSuggestionClick, error, onRetry } ) => {
	if ( cameFromApproveModal ) {
		return (
			<Transition
				as={ Fragment }
				show={ isVisible }
				enter="yst-transition-opacity yst-duration-300 yst-delay-300"
				enterFrom="yst-opacity-0"
				enterTo="yst-opacity-100"
			>
				<div>
					<ContentSuggestionsModal
						status={ status }
						isPremium={ isPremium }
						onSuggestionClick={ onSuggestionClick }
						error={ error }
						onRetry={ onRetry }
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
			error={ error }
			onRetry={ onRetry }
		/>
	);
};

/**
 * Applies the content outline to the post editor.
 *
 * @param {Object}   editedOutlineRef    Ref holding the user's edited outline, if any.
 * @param {Function} getContentOutline   Store action to fetch a content outline.
 * @param {Object}   selectedSuggestion  The selected suggestion to fetch an outline for.
 * @param {Function} resetBlocks         Block editor action to replace all blocks.
 * @param {Function} onAddOutline        Callback after the outline is added.
 * @param {Function} onClose             Callback to close the modal.
 * @returns {Promise<void>} Resolves when the outline has been applied.
 */
const applyOutline = async( editedOutlineRef, getContentOutline, selectedSuggestion, resetBlocks, onAddOutline, onClose ) => {
	const editedOutline = editedOutlineRef.current;
	// Temporary: once the real API endpoint is available, getContentOutline should
	// receive the edited outline so the API can return content notes that match
	// the user's edits. At that point the notesByHeading lookup below can be removed.
	await getContentOutline( selectedSuggestion );
	const apiOutline = select( CONTENT_PLANNER_STORE ).selectContentOutline();

	// Build metadata from the user's edits in the modal.
	const metaOutline = editedOutline
		? {
			title: editedOutline.title,
			metaDescription: editedOutline.metaDescription,
			focusKeyphrase: editedOutline.focusKeyphrase,
			category: editedOutline.category,
		}
		: apiOutline;

	// Build blocks using the user's heading order and the API's content notes.
	let blocksOutline = apiOutline;
	if ( editedOutline ) {
		const notesByHeading = apiOutline.sections.reduce( ( map, section ) => {
			map[ section.heading ] = section.contentNotes;
			return map;
		}, {} );
		blocksOutline = {
			sections: editedOutline.structure
				.filter( ( item ) => item.level !== "FAQ" )
				.map( ( item ) => ( { heading: item.title, contentNotes: notesByHeading[ item.title ] || [] } ) ),
			faqContentNotes: apiOutline.faqContentNotes,
		};
	}

	resetBlocks( buildBlocksFromOutline( blocksOutline ) );
	await applyPostMetaFromOutline( metaOutline );
	onAddOutline();
	onClose();
};

/**
 * Hook that manages error state from the content planner store
 * and provides retry callbacks for suggestions and outline fetches.
 *
 * @param {Function} setStatus              Setter for the modal status state.
 * @param {Function} getContentSuggestions  Store action to fetch content suggestions.
 * @param {Function} getContentOutline      Store action to fetch a content outline.
 * @param {Object|null} selectedSuggestion  The currently selected suggestion (for outline retry).
 * @returns {Object} Error state and retry handlers.
 */
const useErrorHandling = ( setStatus, getContentSuggestions, getContentOutline, selectedSuggestion ) => {
	const {
		suggestionsError,
		suggestionsStoreStatus,
		outlineError,
		outlineStoreStatus,
	} = useSelect( ( storeSelect ) => ( {
		suggestionsError: storeSelect( CONTENT_PLANNER_STORE ).selectContentSuggestionsError(),
		suggestionsStoreStatus: storeSelect( CONTENT_PLANNER_STORE ).selectContentSuggestionsStatus(),
		outlineError: storeSelect( CONTENT_PLANNER_STORE ).selectContentOutlineError(),
		outlineStoreStatus: storeSelect( CONTENT_PLANNER_STORE ).selectContentOutlineStatus(),
	} ), [] );

	useEffect( () => {
		if ( suggestionsStoreStatus === ASYNC_ACTION_STATUS.error ) {
			setStatus( FEATURE_MODAL_STATUS.contentSuggestionsError );
		}
	}, [ suggestionsStoreStatus, setStatus ] );

	useEffect( () => {
		if ( outlineStoreStatus === ASYNC_ACTION_STATUS.error ) {
			setStatus( FEATURE_MODAL_STATUS.contentOutlineError );
		}
	}, [ outlineStoreStatus, setStatus ] );

	const handleRetrySuggestions = useCallback( () => {
		setStatus( FEATURE_MODAL_STATUS.contentSuggestionsLoading );
		getContentSuggestions();
	}, [ setStatus, getContentSuggestions ] );

	const handleRetryOutline = useCallback( () => {
		setStatus( FEATURE_MODAL_STATUS.contentOutline );
		getContentOutline( selectedSuggestion );
	}, [ setStatus, getContentOutline, selectedSuggestion ] );

	return { suggestionsError, outlineError, handleRetrySuggestions, handleRetryOutline };
};

/**
 * Handles the request to add an outline to the post.
 * If the post is empty, applies the outline immediately. Otherwise, prompts for confirmation.
 *
 * @param {boolean}  isEmptyPost         Whether the post is empty.
 * @param {Function} applyOutlineFn      Callback to apply the outline.
 * @param {Function} setHasVisitedReplace Setter for the replace confirmation state.
 * @param {Function} setStatus           Setter for the modal status.
 */
const requestAddOutline = ( isEmptyPost, applyOutlineFn, setHasVisitedReplace, setStatus ) => {
	if ( isEmptyPost ) {
		applyOutlineFn();
		return;
	}
	setHasVisitedReplace( true );
	setStatus( FEATURE_MODAL_STATUS.replaceContent );
};

/**
 * Delays status transitions to allow assistive technology to announce changes.
 * Temporary: the loading → success timer simulates the API call and should be
 * replaced with real store status observation once the endpoint is available.
 *
 * @param {string|null} status    The current modal status.
 * @param {Function}    setStatus Setter for the modal status.
 */
const useStatusTimers = ( status, setStatus ) => {
	useEffect( () => {
		if ( status === null ) {
			const timer = setTimeout( () => setStatus( FEATURE_MODAL_STATUS.idle ), 300 );
			return () => clearTimeout( timer );
		}
		if ( status === FEATURE_MODAL_STATUS.contentSuggestionsLoading ) {
			const timer = setTimeout( () => setStatus( FEATURE_MODAL_STATUS.contentSuggestionsSuccess ), 5000 );
			return () => clearTimeout( timer );
		}
	}, [ status, setStatus ] );
};

/**
 * The modal that orchestrates the flow between the approve, content suggestions,
 * content outline, and replace content confirmation views.
 *
 * @param {boolean}       isOpen                    Whether the modal is open or not.
 * @param {function}      onClose                   The function to call when the modal is closed.
 * @param {boolean}       isEmptyPost             Whether the post has content or not.
 * @param {boolean}       isPremium                 Whether the user has a premium subscription or not.
 * @param {boolean}       isUpsell                  Whether the modal is shown as an upsell or not.
 * @param {string}        upsellLink                The link to the upsell page.
 * @param {function}      onAddOutline              The function to call when the user adds the outline to the post.
 * @param {string|null}   initialStatus             The status to start at when the modal opens. Defaults to null (starts at idle/ApproveModal).
 * @returns {JSX.Element} The Content Planner Feature Modal.
 */

export const FeatureModal = ( {
	isOpen,
	onClose,
	isEmptyPost,
	isPremium,
	isUpsell,
	upsellLink,
	onAddOutline = noop,
	initialStatus = null,
} ) => {
	const [ status, setStatus ] = useState( null );
	const [ selectedSuggestion, setSelectedSuggestion ] = useState( null );
	const [ cameFromApproveModal, setCameFromApproveModal ] = useState( false );
	const [ hasVisitedReplace, setHasVisitedReplace ] = useState( false );
	const editedOutlineRef = useRef( null );
	const { resetBlocks } = useDispatch( "core/block-editor" );
	const { getContentOutline, getContentSuggestions } = useDispatch( CONTENT_PLANNER_STORE );
	const {
		suggestionsError, outlineError, handleRetrySuggestions, handleRetryOutline,
	} = useErrorHandling( setStatus, getContentSuggestions, getContentOutline, selectedSuggestion );

	const handleGetSuggestionsClick = useCallback( () => {
		setCameFromApproveModal( true );
		setStatus( FEATURE_MODAL_STATUS.contentSuggestionsLoading );
	}, [] );

	const handleSuggestionClick = useCallback( ( suggestion ) => {
		setCameFromApproveModal( false );
		setSelectedSuggestion( suggestion );
		setStatus( FEATURE_MODAL_STATUS.contentOutline );
	}, [] );

	const handleBackToSuggestions = useCallback( () => {
		setStatus( FEATURE_MODAL_STATUS.contentSuggestionsSuccess );
	}, [] );

	const handleApplyOutline = useCallback(
		() => applyOutline( editedOutlineRef, getContentOutline, selectedSuggestion, resetBlocks, onAddOutline, onClose ),
		[ getContentOutline, resetBlocks, onClose, onAddOutline, selectedSuggestion ]
	);

	const handleRequestAddOutline = useCallback( ( editedOutline ) => {
		editedOutlineRef.current = editedOutline;
		requestAddOutline( isEmptyPost, handleApplyOutline, setHasVisitedReplace, setStatus );
	}, [ isEmptyPost, handleApplyOutline ] );

	const handleCancelReplace = useCallback( () => {
		setStatus( FEATURE_MODAL_STATUS.contentOutline );
	}, [] );

	const handleConfirmReplace = useCallback( () => {
		handleApplyOutline();
	}, [ handleApplyOutline ] );

	useStatusTimers( status, setStatus );

	useEffect( () => {
		if ( ! isOpen ) {
			setStatus( null );
			setCameFromApproveModal( false );
			setSelectedSuggestion( null );
			setHasVisitedReplace( false );
			return;
		}
		setCameFromApproveModal( false );
		setStatus( initialStatus );
	}, [ isOpen, initialStatus ] );

	const { isSuggestionsVisible, outlineStyle, replaceStyle } = getPanelVisibility( status );

	return (
		<Modal isOpen={ isOpen } onClose={ onClose }>
			<div className="yst-relative yst-w-full yst-max-w-2xl">
				<Transition
					as={ Fragment }
					show={ status === FEATURE_MODAL_STATUS.idle }
					enter="yst-transition-opacity yst-duration-300"
					enterFrom="yst-opacity-0"
					enterTo="yst-opacity-100"
					leave="yst-transition-opacity yst-duration-300 yst-absolute yst-inset-0 yst-m-auto"
					leaveFrom="yst-opacity-100"
					leaveTo="yst-opacity-0"
				>
					<div className="yst-w-96 yst-flex yst-items-center yst-justify-center yst-mx-auto">
						<ApproveModal
							isEmptyPost={ isEmptyPost }
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
					error={ suggestionsError }
					onRetry={ handleRetrySuggestions }
				/>
				{ /*
				 * Once the replace confirmation has been visited, keep both outline and
				 * confirmation panels mounted and toggle via display:none to avoid a
				 * one-frame empty container between panel swaps.
				 */ }
				{ /* Temporary: replace hardcoded outline data with real API response based on selectedSuggestion. */ }
				{ selectedSuggestion && (
					<div style={ outlineStyle }>
						<ContentOutlineModal
							isActive={ status === FEATURE_MODAL_STATUS.contentOutline || status === FEATURE_MODAL_STATUS.contentOutlineError }
							onBack={ handleBackToSuggestions }
							onAddOutline={ handleRequestAddOutline }
							sparksLimit={ 10 }
							sparksUsage={ 1 }
							category="Baking"
							error={ outlineError }
							onRetry={ handleRetryOutline }
							suggestion={ {
								intent: selectedSuggestion.intent,
								title: "The complete guide to sourdough bread",
								description: selectedSuggestion.description,
								focusKeyphrase: "sourdough bread",
								metaDescription: "Learn how to bake sourdough bread at home, from making your starter to baking your first loaf.",
								structure: [
									{ level: "H2", title: "What is sourdough bread?" },
									{ level: "H2", title: "How to make a sourdough starter" },
									{ level: "H2", title: "Choosing the right flour" },
									{ level: "H2", title: "Mixing and shaping the dough" },
									{ level: "H2", title: "Bulk fermentation and proofing" },
									{ level: "H2", title: "Baking your sourdough loaf" },
									{ level: "FAQ", title: "FAQ" },
								],
							} }
						/>
					</div>
				) }
				{ hasVisitedReplace && (
					<div style={ replaceStyle }>
						<div className="yst-flex yst-items-center yst-justify-center">
							<ReplaceContentModal
								isActive={ status === FEATURE_MODAL_STATUS.replaceContent }
								onCancel={ handleCancelReplace }
								onConfirm={ handleConfirmReplace }
							/>
						</div>
					</div>
				) }
			</div>
		</Modal>
	);
};
