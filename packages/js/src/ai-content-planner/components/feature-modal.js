/* eslint-disable complexity */
import { ASYNC_ACTION_STATUS } from "../../shared-admin/constants";
import { Badge, Modal, Notifications, useSvgAria, Link } from "@yoast/ui-library";
import { useCallback, useRef, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import SuggestionsModalContent from "../containers/suggestions-modal-content";
import OutlineModalContent from "../containers/outline-modal-content";
import { FEATURE_MODAL_STATUS } from "../constants";
import { useFetchContentOutline } from "../hooks";
import { SparksLimitNotification } from "../../ai-generator/components/sparks-limit-notification";
import { useMeasuredRef } from "../../ai-generator/hooks";
import { ReactComponent as YoastIcon } from "../../../images/Yoast_icon_kader.svg";
import { UsageCounter } from "@yoast/ai-frontend";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { getModalNotificationPosition } from "../../shared-admin/helpers";
import { ReplaceContentModal } from "./replace-content-modal";

/**
 * The modal that orchestrates the flow between the approve, content suggestions,
 * content outline, and replace content confirmation views.
 *
 * @param {Function}      onClose                         The function to call when the modal is closed.
 * @param {boolean}       isEmptyPost                     Whether the post has content or not.
 * @param {boolean}       isPremium                       Whether the user has a premium subscription or not.
 * @param {string|null}   status                          The current feature modal status from the store.
 * @param {string}        modalHelpLink                  The link to the help center article about the content planner feature.
 * @param {number}        [usageCount]                     The current usage count of the AI features.
 * @param {number}        [usageCountLimit]                The usage count limit of the AI features.
 * @param {string}        contentSuggestionsStatus       The status of the content suggestions request.
 * @param {string}        contentOutlineStatus           The status of the content outline request.
 * @param {string}        usageCountStatus              The status of the usage count request.
 * @param {Function}      openReplaceContentModal       Function to open the replace content confirmation modal.
 * @param {Function}      setHasVisitedReplace          Function to set whether the user has visited the replace content confirmation modal.
 * @param {Object}        editedOutlineRef              Ref object to store the edited content outline.
 * @param {Function}      handleApplyOutline           Function to apply the content outline to the post.
 * @param {boolean}       isReplaceModalOpen           Whether the replace content confirmation modal is open.
 * @param {Function}      onCloseReplace               Function to close the replace content confirmation modal.
 * @returns {JSX.Element} The Content Planner Feature Modal.
 */
export const FeatureModal = ( {
	onClose,
	isEmptyPost,
	isPremium,
	status,
	modalHelpLink,
	usageCount,
	usageCountLimit,
	contentSuggestionsStatus,
	contentOutlineStatus,
	usageCountStatus,
	openReplaceContentModal,
	setHasVisitedReplace,
	editedOutlineRef,
	handleApplyOutline,
	isReplaceModalOpen,
	onCloseReplace,
} ) => {
	const fetchContentOutline = useFetchContentOutline();
	const isConsentModalOpen = status === FEATURE_MODAL_STATUS.consent;
	const svgAriaProps = useSvgAria();
	const closeButtonRef = useRef( null );
	const isSuggestions = status === FEATURE_MODAL_STATUS.contentSuggestions;
	const isSuggestionsError = contentSuggestionsStatus === ASYNC_ACTION_STATUS.error;
	const isOutline = status === FEATURE_MODAL_STATUS.contentOutline;
	const isOutlineError = contentOutlineStatus === ASYNC_ACTION_STATUS.error;

	const [ panelHeight, setPanelHeight ] = useState( 0 );
	const handlePanelMeasureChange = useCallback( entry => setPanelHeight( entry.borderBoxSize[ 0 ].blockSize ), [ setPanelHeight ] );
	const panelRef = useMeasuredRef( handlePanelMeasureChange );
	const { bottom } = getModalNotificationPosition( panelHeight );

	/**
	 * Handles the click on a content suggestion.
	 * Sets the selected suggestion, updates the modal status to show the outline, and fetches the content outline for the selected suggestion.
	 *
	 * @param {Object} suggestion The selected content suggestion.
	 * @returns {void}
	 */
	const handleSuggestionClick = useCallback( ( suggestion ) => {
		fetchContentOutline( suggestion );
	}, [ fetchContentOutline ] );

	/**
	 * Handle the apply outline action when the user confirms applying the generated outline to their post.
	 *
	 * @param {Object} editedOutline The content outline with any edits the user has made in the OutlineModal.
	 * @returns {void}
	 */
	const handleOnApplyOutline = useCallback( ( editedOutline ) => {
		editedOutlineRef.current = editedOutline;
		if ( isEmptyPost ) {
			handleApplyOutline();
			return;
		}
		setHasVisitedReplace( true );
		openReplaceContentModal();
	}, [ isEmptyPost, handleApplyOutline, openReplaceContentModal, setHasVisitedReplace ] );

	return (
		<Modal isOpen={ ! isConsentModalOpen && ( isSuggestions || isOutline ) } onClose={ onClose }>
			{ /*
			 * ReplaceContentModal is inside Modal.Panel so that:
			 * 1. Modal receives a single element child (required by HeadlessUI Transition.Child with as=Fragment).
			 * 2. ReplaceContentModal's Dialog is a React descendant of the outer Dialog, so HeadlessUI v1.7
			 *    detects it as nested and manages the focus trap stack correctly (outer yields focus to inner).
			 */ }
			<Modal.Panel ref={ panelRef } className="yst-p-0 yst-max-w-2xl yst-overflow-visible" hasCloseButton={ false }>
				<Modal.CloseButton
					ref={ closeButtonRef } screenReaderText={ isSuggestions
						? __( "Close content suggestions modal", "wordpress-seo" ) : __( "Close content outline modal", "wordpress-seo" ) }
				/>
				<Modal.Container>
					<Modal.Container.Header className="yst-flex yst-items-center yst-gap-2 yst-pe-14 yst-py-6 yst-ps-6 yst-border-b yst-border-slate-200">
						<YoastIcon className="yst-fill-primary-500 yst-w-4 yst-mb-[1px]" { ...svgAriaProps } />
						<Modal.Title size="2">{ isSuggestions ? __( "Content suggestions", "wordpress-seo" ) : __( "Content outline", "wordpress-seo" ) }</Modal.Title>
						<Link
							href={ modalHelpLink }
							variant="primary"
							className="yst-no-underline"
							target="_blank"
							rel="noopener noreferrer"
							aria-label={ __( "Learn more about AI (Opens in a new browser tab)", "wordpress-seo" ) }
						>
							<QuestionMarkCircleIcon { ...svgAriaProps } className="yst-w-4 yst-h-4 yst-text-slate-500 yst-shrink-0" />
						</Link>
						<span className="yst-flex-grow" />
						<Badge size="small">{ __( "Beta", "wordpress-seo" ) }</Badge>
						{ ( ( isSuggestions && ! isSuggestionsError ) ||
                            ( isOutline && ! isOutlineError )   ) &&
								(
									<UsageCounter
										className="yst-relative yst-flex yst-items-center"
										limit={ usageCountLimit }
										requests={ usageCount }
										mentionBetaInTooltip={ isPremium }
										mentionResetInTooltip={ isPremium }
										isSkeleton={
											contentSuggestionsStatus === ASYNC_ACTION_STATUS.loading ||
											usageCountStatus === ASYNC_ACTION_STATUS.loading }
									/>
								) }
					</Modal.Container.Header>
					{ isSuggestions && <SuggestionsModalContent
						onSuggestionClick={ handleSuggestionClick }
						closeButtonRef={ closeButtonRef }
					/> }

					{ isOutline && (
						<OutlineModalContent
							onApplyOutline={ handleOnApplyOutline }
							closeButtonRef={ closeButtonRef }
						/>
					) }
				</Modal.Container>
				<Notifications
					// Position the notification outside the modal panel at the bottom left of the screen.
					className="yst-mx-[calc(50%-50vw)] yst-transition-all"
					style={ { bottom } }
					position="bottom-left"
				>
					{ contentSuggestionsStatus === ASYNC_ACTION_STATUS.success &&
					! isOutlineError && <SparksLimitNotification /> }
				</Notifications>
				<ReplaceContentModal
					isOpen={ isReplaceModalOpen }
					onConfirm={ handleApplyOutline }
					onClose={ onCloseReplace }
				/>
			</Modal.Panel>
		</Modal>
	);
};
