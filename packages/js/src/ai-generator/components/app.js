import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { useDispatch, useSelect } from "@wordpress/data";
import { Fragment, useCallback, useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { UsageCounter } from "@yoast/ai-frontend";
import { Badge, Link, Modal, useSvgAria, useToggleState } from "@yoast/ui-library";
import { noop } from "lodash";
import PropTypes from "prop-types";
import { STORE_NAME_AI, STORE_NAME_EDITOR } from "../constants";
import { focusFocusKeyphraseInput, isConsideredEmpty } from "../helpers";
import { useLocation, useMeasuredRef, useModalTitle, useTypeContext } from "../hooks";
import { FETCH_USAGE_COUNT_SUCCESS_ACTION_NAME } from "../store/usage-count";
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

const DISPLAY = {
	buttonOnly: "buttonOnly",
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
	const { editType } = useTypeContext();
	const location = useLocation();
	const title = useModalTitle();
	const {
		hasConsent,
		promptContentInitialized,
		currentSubscriptions,
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
		isFreeSparks,
	} = useSelect( select => {
		const aiSelect = select( STORE_NAME_AI );
		const editorSelect = select( STORE_NAME_EDITOR );
		return {
			hasConsent: aiSelect.selectHasAiGeneratorConsent(),
			promptContentInitialized: aiSelect.selectPromptContentInitialized(),
			currentSubscriptions: aiSelect.selectProductSubscriptions(),
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
			isFreeSparks: select( STORE_NAME_AI ).selectIsFreeSparks(),
		};
	}, [] );
	const [ isOpen, , , setOpen ] = useToggleState( false );
	const [ display, setDisplay ] = useState( DISPLAY.buttonOnly );
	const { fetchUsageCount } = useDispatch( STORE_NAME_AI );
	const { closeEditorModal } = useDispatch( STORE_NAME_EDITOR );

	/* translators: Hidden accessibility text. */
	const closeButtonScreenReaderText = __( "Close modal", "wordpress-seo" );
	const [ panelHeight, setPanelHeight ] = useState( 0 );
	const handlePanelMeasureChange = useCallback( entry => setPanelHeight( entry.borderBoxSize[ 0 ].blockSize ), [ setPanelHeight ] );
	const panelRef = useMeasuredRef( handlePanelMeasureChange );

	const closeModal = useCallback( () => {
		setDisplay( DISPLAY.buttonOnly );
	}, [] );

	const commonModalProps = {
		onClose: closeModal,
		closeButtonScreenReaderText,
	};

	const checkFocusKeyphrase = useCallback( () => {
		if ( isConsideredEmpty( focusKeyphrase ) ) {
			closeModal();
			closeEditorModal();
			// Give JS time to close the modals (with focus traps) before trying to focus the input field.
			setTimeout( () => focusFocusKeyphraseInput( location ), 0 );
			return false;
		}
		return true;
	}, [ focusKeyphrase, closeModal, closeEditorModal, location ] );

	const checkSparks = useCallback( async() => {
		const { type, payload } = fetchUsageCount( { endpoint: usageCountEndpoint } );
		if ( type !== FETCH_USAGE_COUNT_SUCCESS_ACTION_NAME ) {
			return false;
		}
		return payload.count < payload.limit;
	}, [ fetchUsageCount, usageCountEndpoint ] );

	const checkSubscriptions = useCallback( () => {
		if ( isWooSeoActive && isWooCommerceActive && isProductEntity ) {
			return hasValidWooSubscription;
		}
		if ( isPremium ) {
			return hasValidPremiumSubscription;
		}
		return true;
	}, [ hasValidPremiumSubscription, hasValidWooSubscription, isPremium, isWooSeoActive && isWooCommerceActive && isProductEntity ] );

	// eslint-ignore-line complexity -- this is a complex component with multiple states and conditions.
	useEffect( () => {
		if ( ! isOpen ) {
			return;
		}

		// Notify that the user has interacted with the feature.
		onUseAi();

		// Can the user have free sparks?
		if ( ! isPremium && ! isFreeSparks ) {
			// If the user has not used the AI feature before, we show the upsell modal.
			setDisplay( DISPLAY.upsell );
			return;
		}

		// Do we have consent?
		if ( ! hasConsent ) {
			// If the user has not granted consent, we open the modal to ask for it.
			setDisplay( DISPLAY.askConsent );
			return;
		}

		// Are the subscriptions valid?
		if ( isPremium && ! checkSubscriptions() ) {
			// If the subscriptions are invalid, show an error message.
			setDisplay( DISPLAY.error );
			return;
		}

		// Is the SEO analysis active?
		if ( ! isSeoAnalysisActive ) {
			// If the SEO analysis is not active, show an error message.
			setDisplay( DISPLAY.error );
			return;
		}

		// Do we have a focus keyphrase?
		if ( ! checkFocusKeyphrase() ) {
			return;
		}

		// Are we in trial mode?
		if ( ! isPremium && isFreeSparks ) {
			// If we are in trial mode, we check if the user has enough sparks left.
			if ( ! checkSparks() ) {
				// If the user has no more sparks left, we show the upsell modal.
				setDisplay( DISPLAY.upsell );
				return;
			}
		}

		setDisplay( DISPLAY.generate );
	}, [
		isOpen,
		onUseAi,
		setDisplay,
		hasConsent,
		isPremium,
		isFreeSparks,
		checkSubscriptions,
		isSeoAnalysisActive,
		checkFocusKeyphrase,
		checkSparks,
	] );

	return (
		<>
			<button
				type="button"
				id={ `yst-replacevar__use-ai-button__${ editType }__${ location }` }
				className="yst-replacevar__use-ai-button"
				onClick={ setOpen }
				disabled={ ! promptContentInitialized }
			>
				{ __( "Use AI", "wordpress-seo" ) }
			</button>

			<IntroductionModal
				{ ...commonModalProps }
				isOpen={ [ DISPLAY.askConsent, DISPLAY.upsell ].includes( display ) }
			>
				{ display === DISPLAY.askConsent && (
					<Introduction onStartGenerating={ noop } />
				) }
				{ display === DISPLAY.upsell && (
					<UpsellModalContent />
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
					<FeatureError currentSubscriptions={ currentSubscriptions } isSeoAnalysisActive={ isSeoAnalysisActive } />
				) }
				{ display === DISPLAY.generate && (
					<>
						<UsageCounter
							limit={ usageCountLimit }
							requests={ usageCount }
							isSkeleton={ false }
							className={ "yst-absolute yst-top-[-11px] yst-end-12 sm:yst-end-16" }
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
