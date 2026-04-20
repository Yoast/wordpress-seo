import { Modal } from "@yoast/ui-library";
import { Fragment, useState, useEffect, useCallback, useRef } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { ApproveModal } from "./approve-modal";
import { AiGrantConsent } from "../../shared-admin/components";
import ContentSuggestionsModal from "../containers/content-suggestions-modal";
import ContentOutlineModal from "../containers/content-outline-modal";
import { ReplaceContentModal } from "./replace-content-modal";
import { Transition } from "@headlessui/react";
import { FEATURE_MODAL_STATUS, CONTENT_PLANNER_STORE } from "../constants";
import { STORE_NAME_EDITOR, STORE_NAME_AI } from "../../ai-generator/constants";
import { useFetchContentSuggestions, useFetchContentOutline, useApplyOutline } from "../hooks";

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
const SuggestionsPanel = ( { isVisible, cameFromApproveModal, status, onSuggestionClick } ) => {
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
			onSuggestionClick={ onSuggestionClick }
			skipTransitions={ true }
		/>
	);
};

/**
 * The modal that orchestrates the flow between the approve, content suggestions,
 * content outline, and replace content confirmation views.
 *
 * @param {boolean}       isOpen                          Whether the modal is open or not.
 * @param {function}      onClose                         The function to call when the modal is closed.
 * @param {boolean}       isEmptyPost                     Whether the post has content or not.
 * @param {boolean}       isPremium                       Whether the user has a premium subscription or not.
 * @param {boolean}       isUpsell                        Whether the modal is shown as an upsell or not.
 * @param {string}        upsellLink                      The link to the upsell page.
 * @param {string|null}   status                          The current feature modal status from the store.
 * @param {function}      setStatus                       Dispatch to update the feature modal status in the store.
 * @param {boolean}       hasConsent                      Whether the user has granted AI consent.
 * @returns {JSX.Element} The Content Planner Feature Modal.
 */

export const FeatureModal = ( {
	isOpen,
	onClose,
	isEmptyPost,
	isPremium,
	isUpsell,
	upsellLink,
	status,
	setStatus,
	hasConsent,
} ) => {
	const selectedSuggestion = useSelect( ( select ) => select( CONTENT_PLANNER_STORE ).selectSuggestion(), [] );
	const [ cameFromApproveModal, setCameFromApproveModal ] = useState( false );
	const [ hasVisitedReplace, setHasVisitedReplace ] = useState( false );
	const editedOutlineRef = useRef( null );

	const fetchContentSuggestions = useFetchContentSuggestions();
	const fetchContentOutline = useFetchContentOutline();

	const isConsentModalOpen = status === FEATURE_MODAL_STATUS.consent;

	/**
	 * Handles the click on the "Get content suggestions" button in the ApproveModal.
	 * Sets the flag to indicate the transition is coming from the ApproveModal, then fetches content suggestions.
	 * The flag is used to determine whether to apply a cross-fade transition when showing the SuggestionsPanel.
	 * Updates the modal status to "content-suggestions" once suggestions are requested.
	 *
	 * @returns {void}
	 */
	const handleGetSuggestionsClick = useCallback( () => {
		setCameFromApproveModal( true );
		if ( ! hasConsent ) {
			setStatus( FEATURE_MODAL_STATUS.consent );
			return;
		}
		fetchContentSuggestions();
	}, [ hasConsent, setStatus, fetchContentSuggestions ] );

	/**
	 * Handles the click on a content suggestion.
	 * Sets the selected suggestion, updates the modal status to show the outline, and fetches the content outline for the selected suggestion.
	 *
	 * @param {Object} suggestion The selected content suggestion.
	 * @returns {void}
	 */
	const handleSuggestionClick = useCallback( ( suggestion ) => {
		setCameFromApproveModal( false );
		fetchContentOutline( suggestion );
	}, [ fetchContentOutline ] );

	const handleApplyOutline = useApplyOutline( { editedOutlineRef } );

	const handleOnApplyOutline = useCallback( ( editedOutline ) => {
		editedOutlineRef.current = editedOutline;
		if ( isEmptyPost ) {
			handleApplyOutline();
			return;
		}
		setHasVisitedReplace( true );
		setStatus( FEATURE_MODAL_STATUS.replaceContent );
	}, [ isEmptyPost, handleApplyOutline ] );

	const handleCancelReplace = useCallback( () => {
		setStatus( FEATURE_MODAL_STATUS.contentOutline );
	}, [] );

	const handleConfirmReplace = useCallback( () => {
		handleApplyOutline();
	}, [ handleApplyOutline ] );

	useEffect( () => {
		if ( ! isOpen ) {
			setCameFromApproveModal( true );
			setHasVisitedReplace( false );
			return;
		}
	}, [ isOpen ] );

	useEffect( () => {
		if ( status === FEATURE_MODAL_STATUS.idle ) {
			setCameFromApproveModal( true );
			return;
		}
	}, [ status ] );

	const { outlineStyle, replaceStyle } = getPanelStyles( status );

	return (
		<>
			<Modal isOpen={ isOpen && ! isConsentModalOpen } onClose={ onClose }>
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
						isVisible={ status === FEATURE_MODAL_STATUS.contentSuggestions }
						cameFromApproveModal={ cameFromApproveModal }
						onSuggestionClick={ handleSuggestionClick }
					/>
					{ /*
					 * Once the replace confirmation has been visited, keep both outline and
					 * confirmation panels mounted and toggle via display:none to avoid a
					 * one-frame empty container between panel swaps.
					 */ }
					{ selectedSuggestion && (
						<div style={ outlineStyle }>
							<ContentOutlineModal
								onApplyOutline={ handleOnApplyOutline }
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
			<Modal isOpen={ isOpen && isConsentModalOpen } onClose={ onClose } className="yst-introduction-modal">
				<Modal.Panel
					className="yst-max-w-lg yst-p-0 yst-rounded-3xl"
					closeButtonScreenReaderText={ __( "Close modal", "wordpress-seo" ) }
				>
					<AiGrantConsent
						storeName={ STORE_NAME_AI }
						linkStoreName={ STORE_NAME_EDITOR }
						onConsentGranted={ fetchContentSuggestions }
					/>
				</Modal.Panel>
			</Modal>
		</>
	);
};
