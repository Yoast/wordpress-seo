/* eslint-disable complexity */
import { ASYNC_ACTION_STATUS } from "../../shared-admin/constants";
import { Badge, Modal, Notifications, useSvgAria, Link } from "@yoast/ui-library";
import { useCallback, useRef } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import ContentSuggestionsModalContent from "../containers/content-suggestions-modal-content";
import ContentOutlineModalContent from "../containers/content-outline-modal-content";
import { FEATURE_MODAL_STATUS } from "../constants";
import { useFetchContentOutline, useApplyOutline } from "../hooks";
import { SparksLimitNotification } from "../../ai-generator/components/sparks-limit-notification";
import { ReactComponent as YoastIcon } from "../../../images/Yoast_icon_kader.svg";
import { UsageCounter } from "@yoast/ai-frontend";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";

/**
 * The modal that orchestrates the flow between the approve, content suggestions,
 * content outline, and replace content confirmation views.
 *
 * @param {Function}      onClose                         The function to call when the modal is closed.
 * @param {boolean}       isEmptyPost                     Whether the post has content or not.
 * @param {boolean}       isPremium                       Whether the user has a premium subscription or not.
 * @param {string|null}   status                          The current feature modal status from the store.
 * @param {string}        modalHelpLink                  The link to the help center article about the content planner feature.
 * @param {number}        usageCount                     The current usage count of the AI features.
 * @param {number}        usageCountLimit                The usage count limit of the AI features.
 * @param {string}        contentSuggestionsStatus       The status of the content suggestions request.
 * @param {string}        contentOutlineStatus           The status of the content outline request.
 * @param {string}        usageCountStatus              The status of the usage count request.
 * @param {Function}      openReplaceContentModal       Function to open the replace content confirmation modal.
 * @param {Function}      setHasVisitedReplace          Function to set whether the user has visited the replace content confirmation modal.
 * @param {Object}        editedOutlineRef              Ref object to store the edited content outline.
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
} ) => {
	const fetchContentOutline = useFetchContentOutline();
	const isConsentModalOpen = status === FEATURE_MODAL_STATUS.consent;
	const svgAriaProps = useSvgAria();
	const closeButtonRef = useRef( null );
	const handleApplyOutline = useApplyOutline( { editedOutlineRef } );

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

		<Modal
			isOpen={ ! isConsentModalOpen &&
				( status === FEATURE_MODAL_STATUS.contentSuggestions || status === FEATURE_MODAL_STATUS.contentOutline ) } onClose={ onClose }
		>
			<Modal.Panel className="yst-p-0 yst-max-w-2xl yst-overflow-visible" hasCloseButton={ false }>
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
					{ status === FEATURE_MODAL_STATUS.contentSuggestions && <ContentSuggestionsModalContent
						onSuggestionClick={ handleSuggestionClick }
					/> }

					{ status === FEATURE_MODAL_STATUS.contentOutline && (
						<ContentOutlineModalContent
							onApplyOutline={ handleOnApplyOutline }
							closeButtonRef={ closeButtonRef }
						/>
					) }
				</Modal.Container>
				<Notifications
					className={
						// Margin tricks to break out of the container.
						// Transition to prevent sudden location jumps when loading new suggestions.
						"yst-mx-[calc(50%-50vw)] yst-transition-all"
					}
					position="bottom-left"
				>
					{ contentSuggestionsStatus === ASYNC_ACTION_STATUS.success &&
					contentOutlineStatus !== ASYNC_ACTION_STATUS.error && <SparksLimitNotification /> }
				</Notifications>
			</Modal.Panel>
		</Modal>
	);
};
