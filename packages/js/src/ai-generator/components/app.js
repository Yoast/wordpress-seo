/* eslint-disable complexity */
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { UsageCounter } from "@yoast/ai-frontend";
import { Badge, Link, Modal, Spinner, useSvgAria } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { ASYNC_ACTION_STATUS } from "../../shared-admin/constants";
import { STORE_NAME_AI, STORE_NAME_EDITOR } from "../constants";
import { focusFocusKeyphraseInput, isConsideredEmpty } from "../helpers";
import { useLocation, useMeasuredRef, useModalTitle, useTypeContext } from "../hooks";
import { FETCH_USAGE_COUNT_ERROR_ACTION_NAME } from "../store/usage-count";
import { FeatureError } from "./feature-error";
import { Introduction } from "./introduction";
import { ModalContent } from "./modal-content";
import { UpsellModalContent } from "./upsell-modal-content";

/**
 * Component abstracting the main modal.
 *
 * @param {boolean} isOpen Whether the modal is open.
 * @param {function} onClose Callback for when the modal is closed.
 * @param {string} closeButtonScreenReaderText The screen reader text for the close button.
 * @param {React.Ref} panelRef The reference to the panel.
 * @param {string} title The title of the modal.
 * @param {string} aiModalHelperLink The link to the AI modal helper.
 * @param {React.ReactNode} children The children of the modal.
 *
 * @returns {JSX.Element} The main modal.
 */
const MainModal = ( { isOpen, onClose, closeButtonScreenReaderText, panelRef, title, aiModalHelperLink, children } ) => {
	const svgAriaProps = useSvgAria();

	return (
		<Modal
			className="yst-ai-modal"
			isOpen={ isOpen }
			onClose={ onClose }
		>
			<Modal.Panel ref={ panelRef } className="yst-max-w-3xl yst-relative" closeButtonScreenReaderText={ closeButtonScreenReaderText }>
				<Modal.Container>
					<Modal.Container.Header>
						<div className="yst-flex yst-items-center">
							<span className="yst-logo-icon yst-h-5 yst-w-5" />
							<Modal.Title className="yst-ms-3 yst-me-1.5" as="h1" size="2">{ title }</Modal.Title>
							<Link
								id="ai-modal-learn-more"
								href={ aiModalHelperLink }
								variant="primary"
								className="yst-no-underline yst-me-2"
								target="_blank"
								rel="noopener"
								/* translators: Hidden accessibility text. */
								aria-label={ __( "Learn more about AI (Opens in a new browser tab)", "wordpress-seo" ) }
							>
								<QuestionMarkCircleIcon { ...svgAriaProps } className="yst-w-4 yst-h-4 yst-text-slate-500 yst-shrink-0" />
							</Link>
							<Badge variant="info">{ __( "Beta", "wordpress-seo" ) }</Badge>
						</div>
						<hr className="yst-mt-6 yst--mx-6" />
					</Modal.Container.Header>
					{ children }
				</Modal.Container>
			</Modal.Panel>
		</Modal>
	);
};

/**
 * Component abstracting the introduction modal.
 *
 * @param {boolean} isOpen Whether the modal is open.
 * @param {function} onClose Callback for when the modal is closed.
 * @param {string} closeButtonScreenReaderText The screen reader text for the close button.
 * @param {React.ReactNode} children The children of the modal.
 *
 * @returns {JSX.Element} The introduction modal.
 */
const IntroductionModal = ( { isOpen, onClose, closeButtonScreenReaderText, children } ) => (
	<Modal
		className="yst-introduction-modal"
		isOpen={ isOpen }
		onClose={ onClose }
	>
		<Modal.Panel
			className="yst-max-w-lg yst-p-0 yst-rounded-3xl"
			closeButtonScreenReaderText={ closeButtonScreenReaderText }
		>
			{ children }
		</Modal.Panel>
	</Modal>
);

export const DISPLAY = {
	inactive: "inactive",
	askConsent: "askConsent",
	upsell: "upsell",
	error: "error",
	generate: "generate",
};

/**
 * @param {function} onUseAi Callback for when the user clicks on the use AI button.
 * @returns {JSX.Element} The element.
 */
export const App = ( { onUseAi } ) => {
	const [ display, setDisplay ] = useState( DISPLAY.inactive );
	const { editType } = useTypeContext();
	const location = useLocation();
	const title = useModalTitle();
	const {
		hasConsent,
		promptContentInitialized,
		currentSubscriptions,
		usageCountStatus,
		usageCount,
		usageCountLimit,
		usageCountEndpoint,
		hasValidPremiumSubscription,
		hasValidWooSubscription,
		focusKeyphrase,
		isPremium,
		isWooSeoActive,
		isWooCommerceActive,
		isSeoAnalysisActive,
		aiModalHelperLink,
		isProductEntity,
		isFreeSparksActive,
	} = useSelect( select => {
		const aiSelect = select( STORE_NAME_AI );
		const editorSelect = select( STORE_NAME_EDITOR );
		return {
			hasConsent: aiSelect.selectHasAiGeneratorConsent(),
			promptContentInitialized: aiSelect.selectPromptContentInitialized(),
			currentSubscriptions: aiSelect.selectProductSubscriptions(),
			usageCountStatus: aiSelect.selectUsageCountStatus(),
			usageCount: aiSelect.selectUsageCount(),
			usageCountLimit: aiSelect.selectUsageCountLimit(),
			usageCountEndpoint: aiSelect.selectUsageCountEndpoint(),
			hasValidPremiumSubscription: aiSelect.selectPremiumSubscription(),
			hasValidWooSubscription: aiSelect.selectWooCommerceSubscription(),
			focusKeyphrase: editorSelect.getFocusKeyphrase(),
			isPremium: editorSelect.getIsPremium(),
			isWooSeoActive: editorSelect.getIsWooSeoActive(),
			isWooCommerceActive: editorSelect.getIsWooCommerceActive(),
			isSeoAnalysisActive: editorSelect.getPreference( "isKeywordAnalysisActive", true ),
			aiModalHelperLink: editorSelect.selectLink( "https://yoa.st/ai-generator-help-button-modal" ),
			isProductEntity: editorSelect.getIsProductEntity(),
			isFreeSparksActive: select( STORE_NAME_AI ).selectIsFreeSparksActive(),
		};
	}, [] );
	const { fetchUsageCount } = useDispatch( STORE_NAME_AI );
	const { closeEditorModal } = useDispatch( STORE_NAME_EDITOR );

	/* translators: Hidden accessibility text. */
	const closeButtonScreenReaderText = __( "Close modal", "wordpress-seo" );
	const buttonId = `yst-replacevar__use-ai-button__${ editType }__${ location }`;
	const [ loadingButtonId, setLoadingButtonId ] = useState( null );
	const [ panelHeight, setPanelHeight ] = useState( 0 );
	const handlePanelMeasureChange = useCallback( entry => setPanelHeight( entry.borderBoxSize[ 0 ].blockSize ), [ setPanelHeight ] );
	const panelRef = useMeasuredRef( handlePanelMeasureChange );

	const closeModal = useCallback( () => {
		setDisplay( DISPLAY.inactive );
	}, [] );

	const commonModalProps = {
		onClose: closeModal,
		closeButtonScreenReaderText,
	};

	const checkFocusKeyphrase = useCallback( () => ! isConsideredEmpty( focusKeyphrase ), [ focusKeyphrase ] );
	const showFocusKeyphrase = useCallback( () => {
		closeEditorModal();
		// Give JS time to close the modals (with focus traps) before trying to focus the input field.
		setTimeout( () => focusFocusKeyphraseInput( location ), 0 );
	}, [ closeEditorModal, location ] );

	const checkSubscriptions = useCallback( () => {
		if ( isWooSeoActive && isWooCommerceActive && isProductEntity ) {
			return hasValidWooSubscription;
		}
		if ( isPremium ) {
			return hasValidPremiumSubscription;
		}
		return true;
	}, [ hasValidPremiumSubscription, hasValidWooSubscription, isPremium, isWooSeoActive && isWooCommerceActive && isProductEntity ] );

	const handleUseAi = useCallback( async( event ) => {
		if ( event.target.id === buttonId ) {
			setLoadingButtonId( buttonId );
		}
		onUseAi();
		const { type, payload } = await fetchUsageCount( { endpoint: usageCountEndpoint } );
		const sparksLimitReched = payload === 429 || payload.count >= payload.limit;

		if ( type === FETCH_USAGE_COUNT_ERROR_ACTION_NAME && payload !== 429 ) {
			setDisplay( DISPLAY.error );
			return;
		}

		if ( ! isPremium && ! isFreeSparksActive ) {
			setDisplay( DISPLAY.upsell );
			return;
		}

		if ( ! hasConsent ) {
			setDisplay( DISPLAY.askConsent );
			return;
		}

		if ( ! isSeoAnalysisActive ) {
			setDisplay( DISPLAY.error );
			return;
		}

		if ( ! checkFocusKeyphrase() ) {
			setDisplay( DISPLAY.inactive );
			showFocusKeyphrase();
			return;
		}

		if ( isPremium && ! checkSubscriptions() ) {
			setDisplay( DISPLAY.error );
			return;
		}

		if ( ! isPremium && sparksLimitReched ) {
			setDisplay( DISPLAY.upsell );
			return;
		}

		setDisplay( DISPLAY.generate );
	}, [ onUseAi,
		isPremium,
		isFreeSparksActive,
		hasConsent,
		isSeoAnalysisActive,
		checkFocusKeyphrase,
		showFocusKeyphrase,
		usageCountEndpoint,
		fetchUsageCount ] );

	const onStartGenerating = useCallback( () => {
		setDisplay( DISPLAY.generate );
	}, [ setDisplay ] );

	const onActivateFreeSparks = useCallback( () => {
		if ( ! hasConsent ) {
			setDisplay( DISPLAY.askConsent );
			return;
		}
		setDisplay( DISPLAY.generate );
	}, [ setDisplay, hasConsent ] );

	return (
		<>
			<button
				type="button"
				id={ buttonId }
				className="yst-replacevar__use-ai-button"
				onClick={ handleUseAi }
				disabled={ usageCountStatus === ASYNC_ACTION_STATUS.loading || ! promptContentInitialized }
			>
				{ loadingButtonId === buttonId && usageCountStatus === ASYNC_ACTION_STATUS.loading  && (
					<Spinner className="yst-me-2" />
				) }
				{ __( "Use AI", "wordpress-seo" ) }
			</button>

			<IntroductionModal
				{ ...commonModalProps }
				isOpen={ [ DISPLAY.askConsent, DISPLAY.upsell ].includes( display ) }
			>
				{ display === DISPLAY.askConsent && (
					<Introduction onStartGenerating={ onStartGenerating } />
				) }
				{ display === DISPLAY.upsell && (
					<UpsellModalContent onActivateFreeSparks={ onActivateFreeSparks } />
				) }
			</IntroductionModal>

			<MainModal
				{ ...commonModalProps }
				isOpen={ [ DISPLAY.error, DISPLAY.generate ].includes( display ) }
				helpLink={ aiModalHelperLink }
				panelRef={ panelRef }
				title={ title }
			>
				{ display === DISPLAY.error && (
					<Modal.Container.Content className="yst-pt-6">
						<FeatureError currentSubscriptions={ currentSubscriptions } isSeoAnalysisActive={ isSeoAnalysisActive } />
					</Modal.Container.Content>
				) }
				{ display === DISPLAY.generate && (
					<>
						<UsageCounter
							limit={ usageCountLimit }
							requests={ usageCount }
							isSkeleton={ false }
							className={ "yst-absolute yst-top-[-11px] yst-end-12 sm:yst-end-16" }
							mentionBetaInTooltip={ isPremium }
						/>
						<ModalContent height={ panelHeight } />
					</>
				) }
			</MainModal>
		</>
	);
};
App.propTypes = {
	onUseAi: PropTypes.func.isRequired,
};
