/* eslint-disable max-statements */
/* eslint-disable complexity */
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useState, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { UsageCounter, GradientButton } from "@yoast/ai-frontend";
import { Badge, Link, Modal, useSvgAria } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { ASYNC_ACTION_STATUS } from "../../shared-admin/constants";
import {
	STORE_NAME_AI,
	STORE_NAME_EDITOR,
	STORE_NAME_CORE_EDITOR,
	STORE_NAME_CORE_EDIT_POST,
} from "../constants";
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
	const { editType, previewType } = useTypeContext();
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
		isSeoAnalysisActive,
		aiModalHelperLink,
		isWooProductEntity,
		isFreeSparksActive,
		isWooSeoActive,
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
			isSeoAnalysisActive: editorSelect.getPreference( "isKeywordAnalysisActive", true ),
			aiModalHelperLink: editorSelect.selectLink( "https://yoa.st/ai-generator-help-button-modal" ),
			isWooProductEntity: editorSelect.getIsWooProductEntity(),
			isFreeSparksActive: select( STORE_NAME_AI ).selectIsFreeSparksActive(),
		};
	}, [] );
	const { fetchUsageCount } = useDispatch( STORE_NAME_AI );
	const { closeEditorModal } = useDispatch( STORE_NAME_EDITOR );

	/* translators: Hidden accessibility text. */
	const closeButtonScreenReaderText = __( "Close modal", "wordpress-seo" );
	const [ loading, setLoading ] = useState( false );
	const [ panelHeight, setPanelHeight ] = useState( 0 );
	const handlePanelMeasureChange = useCallback( entry => setPanelHeight( entry.borderBoxSize[ 0 ].blockSize ), [ setPanelHeight ] );
	const panelRef = useMeasuredRef( handlePanelMeasureChange );
	const openGeneralSidebar = useDispatch( STORE_NAME_CORE_EDIT_POST )?.openGeneralSidebar;
	const closePublishSidebar = useDispatch( STORE_NAME_CORE_EDITOR )?.closePublishSidebar;

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

		if ( location === "pre-publish" ) {
			closePublishSidebar();
			openGeneralSidebar( "yoast-seo/seo-sidebar" );
		}

		// Give JS time to close the modals (with focus traps) before trying to focus the input field.
		setTimeout( () => focusFocusKeyphraseInput( location ), 0 );
	}, [ closeEditorModal, location, closePublishSidebar, openGeneralSidebar ] );

	const checkSubscriptions = useCallback( () => {
		if (  isWooProductEntity ) {
			return hasValidWooSubscription && hasValidPremiumSubscription;
		}
		return hasValidPremiumSubscription;
	}, [ hasValidPremiumSubscription, hasValidWooSubscription, isWooProductEntity ] );

	/**
	 * Callback to handle the "Use AI" button click.
	 *
	 * @param {Object} event The click event.
	 * @returns {void}
	 */
	const handleUseAi = useCallback( async() => {
		onUseAi();

		// The analysis feature is not active, so we cannot use AI.
		if ( ! isSeoAnalysisActive ) {
			setDisplay( DISPLAY.error );
			return;
		}

		// Missing focus keyphrase, so we cannot use AI.
		if ( ! checkFocusKeyphrase() ) {
			setDisplay( DISPLAY.inactive );
			showFocusKeyphrase();
			return;
		}

		// Getting the subscriptions.
		const subscriptions = checkSubscriptions();

		// User has no subscription, but premium and woo are installed and it a product entity.
		if ( ! subscriptions && isPremium && isWooSeoActive && isWooProductEntity ) {
			setDisplay( DISPLAY.error );
			return;
		}

		// User has no subscription but premium or woo is installed.
		if ( ! subscriptions && isPremium && ! isWooProductEntity ) {
			// Let the user know that they need to activate their subscription.
			setDisplay( DISPLAY.error );
			return;
		}

		// User revoked consent after clicking on the "Try for free" AI button or has subscriptions.
		if ( ! hasConsent && ( isFreeSparksActive || subscriptions ) ) {
			setDisplay( DISPLAY.askConsent );
			return;
		}

		setLoading( true );

		// Getting the usage count.
		const { type, payload } = await fetchUsageCount( { endpoint: usageCountEndpoint, isWooProductEntity } );
		const rateLimited = payload?.errorCode === 429 && ! payload?.errorIdentifier && payload?.missingLicenses.length === 0;

		const sparksLimitReached = ( payload?.errorCode === 429 && payload?.errorIdentifier === "USAGE_LIMIT_REACHED" ) || payload.count >= payload.limit;

		setLoading( false );
		if ( rateLimited ) {
			setDisplay( DISPLAY.error );
			return;
		}
		// User revoked consent on a different window after clicking on the "Try for free" AI button or has subscription.
		if ( payload?.errorCode === 403 && ( isFreeSparksActive || subscriptions ) ) {
			setDisplay( DISPLAY.askConsent );
			return;
		}

		// The usage count endpoint returned an error that is not related to the limit or consent.
		if ( type === FETCH_USAGE_COUNT_ERROR_ACTION_NAME && payload?.errorCode !== 429 && payload?.errorCode !== 403 ) {
			setDisplay( DISPLAY.error );
			return;
		}

		if ( type === FETCH_USAGE_COUNT_ERROR_ACTION_NAME && payload?.errorCode === 429 && subscriptions ) {
			// If the user has a subscription, but the usage count limit is reached, we show the error.
			setDisplay( DISPLAY.error );
			return;
		}

		// User doesn't have a subscription, and never clicked on the "Try for free" AI button.
		if ( ! subscriptions && ! isFreeSparksActive ) {
			// Upsell with the "Try for free" AI button.
			setDisplay( DISPLAY.upsell );
			return;
		}

		// User has no subscription and the usage count limit is reached.
		if ( ! subscriptions && sparksLimitReached ) {
			// Upsell with the alert that the usage count limit is reached.
			setDisplay( DISPLAY.upsell );
			return;
		}

		// User has subscription, premium and consent
		if ( subscriptions && hasConsent ) {
			setDisplay( DISPLAY.generate );
		}

		// User has no subscription, free sparks is active, didn't reach the usage limit and consent is granted.
		if ( ! subscriptions && isFreeSparksActive && ! sparksLimitReached && hasConsent ) {
			setDisplay( DISPLAY.generate );
		}
	}, [ onUseAi,
		isPremium,
		isFreeSparksActive,
		hasConsent,
		isSeoAnalysisActive,
		checkFocusKeyphrase,
		showFocusKeyphrase,
		usageCountEndpoint,
		fetchUsageCount,
		isWooSeoActive,
		isWooProductEntity,
		loading,
	] );

	/**
	 * Callback to start generating content after granting consent.
	 *
	 * @returns {void}
	 */
	const onStartGenerating = useCallback( async() => {
		// Getting the usage count.
		const { type, payload } = await fetchUsageCount( { endpoint: usageCountEndpoint, isWooProductEntity } );
		const sparksLimitReached = payload?.errorCode === 429 || payload.count >= payload.limit;
		const subscriptions = checkSubscriptions();

		if ( sparksLimitReached && ! subscriptions ) {
			setDisplay( DISPLAY.upsell );
			return;
		}

		if ( type === FETCH_USAGE_COUNT_ERROR_ACTION_NAME ) {
			// User revoked consent after clicking on the "Try for free" AI button.
			setDisplay( DISPLAY.error );
			return;
		}

		setDisplay( DISPLAY.generate );
	}, [ setDisplay, usageCountEndpoint, fetchUsageCount, checkSubscriptions, isWooProductEntity ] );

	/**
	 * Callback to activate free sparks on the upsell modal
	 * after clicking on "Try for free" button.
	 *
	 * @returns {void}
	 */
	const onActivateFreeSparks = useCallback( () => {
		if ( ! hasConsent ) {
			setDisplay( DISPLAY.askConsent );
			return;
		}
		setDisplay( DISPLAY.generate );
	}, [ setDisplay, hasConsent ] );

	const getButtonLabel = useMemo( () => {
		if ( previewType === "google" ) {
			if ( editType === "title" ) {
				return __( "Generate SEO title", "wordpress-seo" );
			}
			return __( "Generate meta description", "wordpress-seo" );
		}
		if ( previewType === "social" || previewType === "twitter" ) {
			if ( editType === "title" ) {
				return __( "Generate social title", "wordpress-seo" );
			}
			return __( "Generate social description", "wordpress-seo" );
		}
	}, [ previewType, editType ] );

	return (
		<>
			<GradientButton
				type="button"
				id={ `yst-replacevar__use-ai-button__${ editType }__${ location }` }
				className="yst-replacevar__use-ai-button"
				onClick={ handleUseAi }
				disabled={ usageCountStatus === ASYNC_ACTION_STATUS.loading || ! promptContentInitialized }
				isLoading={ loading && usageCountStatus === ASYNC_ACTION_STATUS.loading }
			>
				{ getButtonLabel }
			</GradientButton>

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
				aiModalHelperLink={ aiModalHelperLink }
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
							mentionResetInTooltip={ isPremium }
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
