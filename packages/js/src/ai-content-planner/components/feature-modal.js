import { Modal } from "@yoast/ui-library";
import { Fragment, useState, useEffect, useCallback, useRef } from "@wordpress/element";
import { useDispatch, select } from "@wordpress/data";
import { ApproveModal } from "./approve-modal";
import { ContentSuggestionsModal } from "./content-suggestions-modal";
import { ContentOutlineModal } from "./content-outline-modal";
import { ReplaceContentModal } from "./replace-content-modal";
import { Transition } from "@headlessui/react";
import { noop } from "lodash";
import { buildBlocksFromOutline } from "../helpers/build-blocks-from-outline";
import { applyPostMetaFromOutline } from "../helpers/apply-post-meta-from-outline";
import { STORE_NAME } from "../store";
import { FEATURE_MODAL_STATUS } from "../constants";

const HIDDEN_STYLE = { display: "none" };

/**
 * Returns the display styles for the outline and confirmation panels.
 * Both are kept mounted and toggled via display:none to avoid layout flash.
 *
 * @param {string} status The current modal status.
 * @returns {Object} Styles for each panel.
 */
const getPanelStyles = ( status ) => ( {
	outlineStyle: status === FEATURE_MODAL_STATUS.contentOutline ? null : HIDDEN_STYLE,
	replaceStyle: status === FEATURE_MODAL_STATUS.replaceContent ? null : HIDDEN_STYLE,
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
 * content outline, and replace content confirmation views.
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
	const [ hasVisitedReplace, setHasVisitedReplace ] = useState( false );
	const editedOutlineRef = useRef( null );
	const { resetBlocks } = useDispatch( "core/block-editor" );
	const { getContentOutline } = useDispatch( STORE_NAME );

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
		setCameFromApproveModal( false );
		setStatus( FEATURE_MODAL_STATUS.contentSuggestionsSuccess );
	}, [] );

	const handleApplyOutline = useCallback( async() => {
		const editedOutline = editedOutlineRef.current;
		// Temporary: once the real API endpoint is available, getContentOutline should
		// receive the edited outline so the API can return content notes that match
		// the user's edits. At that point the notesByHeading lookup below can be removed.
		await getContentOutline( selectedSuggestion );
		const apiOutline = select( STORE_NAME ).selectContentOutline();

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
	}, [ getContentOutline, resetBlocks, onClose, onAddOutline, selectedSuggestion ] );

	const handleRequestAddOutline = useCallback( ( editedOutline ) => {
		editedOutlineRef.current = editedOutline;
		if ( isEmptyCanvas ) {
			handleApplyOutline();
			return;
		}
		setHasVisitedReplace( true );
		setStatus( FEATURE_MODAL_STATUS.replaceContent );
	}, [ isEmptyCanvas, handleApplyOutline ] );

	const handleCancelReplace = useCallback( () => {
		setStatus( FEATURE_MODAL_STATUS.contentOutline );
	}, [] );

	const handleConfirmReplace = useCallback( () => {
		handleApplyOutline();
	}, [ handleApplyOutline ] );

	useEffect( () => {
		// Delay setting the status to "idle" and "content-suggestions-success" to allow the assistive technology to announce the changes.
		if ( status === null ) {
			const timer = setTimeout( () => setStatus( FEATURE_MODAL_STATUS.idle ), 300 );
			return () => clearTimeout( timer );
		}
		if ( status === FEATURE_MODAL_STATUS.contentSuggestionsLoading ) {
			const timer = setTimeout( () => setStatus( FEATURE_MODAL_STATUS.contentSuggestionsSuccess ), 5000 );
			return () => clearTimeout( timer );
		}
	}, [ status ] );

	useEffect( () => {
		if ( ! isOpen ) {
			setStatus( FEATURE_MODAL_STATUS.idle );
			setCameFromApproveModal( false );
			setSelectedSuggestion( null );
			setHasVisitedReplace( false );
		}
	}, [ isOpen ] );

	const isSuggestionsVisible =
		status === FEATURE_MODAL_STATUS.contentSuggestionsSuccess ||
		status === FEATURE_MODAL_STATUS.contentSuggestionsLoading;
	const { outlineStyle, replaceStyle } = getPanelStyles( status );

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
				{ /*
				 * Once the replace confirmation has been visited, keep both outline and
				 * confirmation panels mounted and toggle via display:none to avoid a
				 * one-frame empty container between panel swaps.
				 */ }
				{ /* Temporary: replace hardcoded outline data with real API response based on selectedSuggestion. */ }
				{ selectedSuggestion && (
					<div style={ outlineStyle }>
						<ContentOutlineModal
							isActive={ status === FEATURE_MODAL_STATUS.contentOutline }
							onBack={ handleBackToSuggestions }
							onAddOutline={ handleRequestAddOutline }
							sparksLimit={ 10 }
							sparksUsage={ 1 }
							category="Baking"
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
