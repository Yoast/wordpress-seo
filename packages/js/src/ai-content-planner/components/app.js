import { Modal, useToggleState } from "@yoast/ui-library";
import { useState, useEffect, useCallback, useRef } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import ApproveModal from "../containers/approve-modal";
import { AiGrantConsent } from "../../shared-admin/components";
import { ReplaceContentModal } from "./replace-content-modal";
import { FEATURE_MODAL_STATUS, CONTENT_PLANNER_STORE } from "../constants";
import { STORE_NAME_EDITOR, STORE_NAME_AI } from "../../ai-generator/constants";
import { useFetchContentSuggestions, useApplyOutline } from "../hooks";
import FeatureModal from "../containers/feature-modal";
import { useSelect, useDispatch } from "@wordpress/data";


/**
 * The modal that orchestrates the flow between the approve, content suggestions,
 * content outline, and replace content confirmation views.
 *
 * @returns {JSX.Element} The Content Planner Feature Modal.
 */
export const App = () => {
	const { isOpen, status, hasConsent } = useSelect( select => {
		const contentPlannerSelectors = select( CONTENT_PLANNER_STORE );
		return {
			isOpen: contentPlannerSelectors.selectIsModalOpen(),
			status: contentPlannerSelectors.selectFeatureModalStatus(),
			hasConsent: select( STORE_NAME_AI ).selectHasAiGeneratorConsent(),
		};
	}, [] );
	const { setStatus, closeModal } = useDispatch( CONTENT_PLANNER_STORE );
	const [ hasVisitedReplace, setHasVisitedReplace ] = useState( false );
	const [ replaceContentModalIsOpen, toggleReplaceContentModal, , openReplaceContentModal  ] = useToggleState( false );
	const editedOutlineRef = useRef( null );
	const handleApplyOutline = useApplyOutline( { editedOutlineRef } );
	const fetchContentSuggestions = useFetchContentSuggestions();
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
		if ( ! hasConsent ) {
			setStatus( FEATURE_MODAL_STATUS.consent );
			return;
		}
		fetchContentSuggestions();
	}, [ hasConsent, setStatus, fetchContentSuggestions ] );

	const handleCancelReplace = useCallback( () => {
		setStatus( FEATURE_MODAL_STATUS.contentOutline );
	}, [ setStatus ] );

	const handleConfirmReplace = useCallback( () => {
		handleApplyOutline();
	}, [ handleApplyOutline ] );

	useEffect( () => {
		if ( ! isOpen ) {
			setHasVisitedReplace( false );
		}
	}, [ isOpen ] );

	return (
		<>
			<ApproveModal
				onClick={ handleGetSuggestionsClick }
			/>
			<FeatureModal
				editedOutlineRef={ editedOutlineRef }
				openReplaceContentModal={ openReplaceContentModal }
				setHasVisitedReplace={ setHasVisitedReplace }
			/>
			<ReplaceContentModal
				onCancel={ handleCancelReplace }
				onConfirm={ handleConfirmReplace }
				isOpen={ replaceContentModalIsOpen && hasVisitedReplace }
				onClose={ toggleReplaceContentModal }
			/>

			<Modal isOpen={ isOpen && isConsentModalOpen } onClose={ closeModal } className="yst-introduction-modal">
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
