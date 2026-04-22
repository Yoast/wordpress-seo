/* eslint-disable complexity */
import { ASYNC_ACTION_STATUS } from "../../shared-admin/constants";
import { Badge, Modal, Notifications, useSvgAria, Link } from "@yoast/ui-library";
import { Fragment, useState, useEffect, useCallback, useRef } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { ApproveModal } from "./approve-modal";
import { AiGrantConsent } from "../../shared-admin/components";
import ContentSuggestionsModal from "../containers/content-suggestions-modal";
import ContentOutlineModal from "../containers/content-outline-modal";
import { ReplaceContentModal } from "./replace-content-modal";
import { Transition } from "@headlessui/react";
import { FEATURE_MODAL_STATUS } from "../constants";
import { STORE_NAME_EDITOR, STORE_NAME_AI } from "../../ai-generator/constants";
import { useFetchContentSuggestions, useFetchContentOutline, useApplyOutline } from "../hooks";
import { SparksLimitNotification } from "../../ai-generator/components/sparks-limit-notification";
import { ReactComponent as YoastIcon } from "../../../images/Yoast_icon_kader.svg";
import { UsageCounter } from "@yoast/ai-frontend";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";

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
 * @param {Function} onSuggestionClick Callback when a suggestion is clicked.
 *
 * @returns {JSX.Element|null} The suggestions panel.
 */
const SuggestionsPanel = ( { isVisible, cameFromApproveModal, onSuggestionClick } ) => {
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
 * @param {string}        modalHelpLink                  The link to the help center article about the content planner feature.
 * @param {number}        usageCount                     The current usage count of the AI features.
 * @param {number}        usageCountLimit                The usage count limit of the AI features.
 * @param {string}        contentSuggestionsStatus       The status of the content suggestions request.
 * @param {string}        contentOutlineStatus           The status of the content outline request.
 * @param {string}        usageCountStatus              The status of the usage count request.
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
	modalHelpLink,
	usageCount,
	usageCountLimit,
	contentSuggestionsStatus,
	contentOutlineStatus,
	usageCountStatus,
} ) => {
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
		}
	}, [ isOpen ] );

	useEffect( () => {
		if ( status === FEATURE_MODAL_STATUS.idle ) {
			setCameFromApproveModal( true );
		}
	}, [ status ] );

	const svgAriaProps = useSvgAria();

	const { outlineStyle, replaceStyle } = getPanelStyles( status );

	const closeButtonRef = useRef( null );

	useEffect( () => {
		if ( status === FEATURE_MODAL_STATUS.contentSuggestions ) {
			closeButtonRef.current?.focus();
		}
	}, [ status ] );

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

					<Modal.Panel className="yst-p-0 yst-max-w-2xl" hasCloseButton={ false }>
						<Modal.CloseButton
							ref={ closeButtonRef } screenReaderText={ status === FEATURE_MODAL_STATUS.contentSuggestions
								? __( "Close content suggestions modal", "wordpress-seo" ) : __( "Close content outline modal", "wordpress-seo" ) }
						/>
						<Modal.Container>
							<Modal.Container.Header className="yst-flex yst-items-center yst-gap-2 yst-pe-12 yst-py-6 yst-ps-6 yst-border-b yst-border-slate-200">
								<YoastIcon className="yst-fill-primary-500 yst-w-4 yst-mb-[1px]" { ...svgAriaProps } />
								<Modal.Title size="2">{ status === FEATURE_MODAL_STATUS.contentSuggestions
									? __( "Content suggestions", "wordpress-seo" ) : __( "Content outline", "wordpress-seo" ) }</Modal.Title>
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
								{ ( contentSuggestionsStatus !== ASYNC_ACTION_STATUS.error &&  contentOutlineStatus !== ASYNC_ACTION_STATUS.error ) &&
								(
									<UsageCounter
										className="yst-relative"
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
							<SuggestionsPanel
								isVisible={ status === FEATURE_MODAL_STATUS.contentSuggestions }
								cameFromApproveModal={ cameFromApproveModal }
								onSuggestionClick={ handleSuggestionClick }
							/>
							{ status === FEATURE_MODAL_STATUS.contentOutline && (
								<div style={ outlineStyle }>
									<ContentOutlineModal
										onApplyOutline={ handleOnApplyOutline }
									/>
								</div>
							) }
							<Notifications
								className={
								// Margin tricks to break out of the container.
								// Transition to prevent sudden location jumps when loading new suggestions.
									"yst-mx-[calc(50%-50vw)] yst-transition-all"
								}
								position="bottom-left"
							>
								{ contentSuggestionsStatus !== ASYNC_ACTION_STATUS.loading && <SparksLimitNotification className="yst-mx-[calc(50%-50vw)] yst-transition-all" /> }
							</Notifications>
						</Modal.Container>
					</Modal.Panel>
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
